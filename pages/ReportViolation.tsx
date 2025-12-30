
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { analyzeEvidence } from '../services/gemini';
import { Camera, MapPin, Upload, Loader2, CheckCircle2, X } from 'lucide-react';

export const ReportViolation: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat: 0,
    lng: 0,
    address: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const captureLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({ 
          ...prev, 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude,
          address: 'Verified via GPS'
        }));
        setLoading(false);
      },
      () => {
        alert("Permission denied. GPS is mandatory for enforcement.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.lat) return;

    setLoading(true);
    try {
      // 1. AI Analysis (First pass)
      const aiResult = await analyzeEvidence(preview, formData.description);
      setAnalysis(aiResult);

      // 2. Real Multipart Upload
      const body = new FormData();
      body.append('evidence', file);
      body.append('title', formData.title);
      body.append('description', formData.description);
      body.append('lat', formData.lat.toString());
      body.append('lng', formData.lng.toString());

      await api.post('/upload/evidence', body, true);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xl mt-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Enforcement File Registered</h3>
        <p className="text-slate-500 mt-2">The report has been saved to the national database for officer review.</p>
        
        {analysis && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl text-left border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI Vision Assessment</h4>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-bold">Category</p>
                 <p className="font-bold text-slate-800">{analysis.classification}</p>
               </div>
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-bold">Confidence</p>
                 <p className="font-bold text-slate-800">{(analysis.confidence * 100).toFixed(0)}%</p>
               </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 italic">"{analysis.reasoning}"</p>
          </div>
        )}

        <button 
          onClick={() => window.location.hash = '/'}
          className="mt-8 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Lodge Enforcement Report</h3>
      <p className="text-slate-500 mb-8">Official citizen report with timestamp and geo-validation.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Incident Headline</label>
              <input 
                type="text" 
                required
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Deviation from approved permit B-123"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Visual Observations</label>
              <textarea 
                required
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none h-32"
                placeholder="Details of the violation seen on site..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
             <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" />
                GPS Verification
             </h4>
             <div className={`p-6 rounded-xl border-2 border-dashed transition-all ${formData.lat ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                {formData.lat ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-green-800 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Coordinates Secured
                      </p>
                      <p className="text-xs text-green-600 font-mono mt-1">{formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}</p>
                    </div>
                    <button type="button" onClick={captureLocation} className="text-xs bg-white px-3 py-1 rounded-full shadow-sm border font-bold">Recapture</button>
                  </div>
                ) : (
                  <button type="button" onClick={captureLocation} className="w-full flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-orange-500">
                      <MapPin />
                    </div>
                    <span className="text-sm font-bold text-slate-600 underline">Enable GPS Tracking</span>
                  </button>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
             <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Camera size={18} className="text-orange-500" />
                Visual Evidence
             </h4>
             <div className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative group overflow-hidden">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => {setFile(null); setPreview('');}} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X size={16} /></button>
                  </>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer">
                    <Upload className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Select File</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
             </div>
             <p className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold tracking-wider">Image/Video Required</p>
          </div>

          <button 
            type="submit"
            disabled={loading || !file || !formData.lat}
            className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'SUBMIT ENFORCEMENT FILE'}
          </button>
        </div>
      </form>
    </div>
  );
};
