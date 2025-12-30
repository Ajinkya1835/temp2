
import React, { useState, useEffect } from 'react';
import { Violation, ViolationStatus } from '../types';
import { api } from '../services/api';
import { CheckCircle, XCircle, Search, ExternalLink, Loader2 } from 'lucide-react';

export const OfficerInspections: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ViolationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/violations');
      setViolations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (id: string, status: ViolationStatus, fineAmount?: number) => {
    const success = await api.patch(`/violations/${id}`, { status, fineAmount });
    if (success) {
      load();
    }
  };

  const filtered = violations.filter(v => {
    const matchesFilter = filter === 'ALL' || v.status === filter;
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                          (v.id || v._id || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Enforcement Registry</h3>
          <p className="text-slate-500">Verify and process reported violations in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search registry..." 
               className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-64"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <select 
              className="p-2 rounded-lg border border-slate-300 text-sm outline-none bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
           >
             <option value="ALL">All Status</option>
             <option value={ViolationStatus.REPORTED}>Reported</option>
             <option value={ViolationStatus.VERIFIED}>Verified</option>
             <option value={ViolationStatus.PAID}>Paid</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-blue-500" size={40} />
             <p className="text-sm font-medium text-slate-500">Fetching Registry Data...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Incident Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">GIS Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v._id || v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={v.evidenceUrls[0]} className="w-12 h-12 rounded object-cover border border-slate-200" alt="Evidence" />
                      <div>
                        <p className="font-bold text-slate-800">{v.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">{v._id || v.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {v.permitId ? (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">ID: {v.permitId}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">GIS VERIFIED</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        v.status === ViolationStatus.REPORTED ? 'bg-amber-100 text-amber-700' :
                        v.status === ViolationStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                        v.status === ViolationStatus.PAID ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                     }`}>
                       {v.status.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex gap-2">
                       {v.status === ViolationStatus.REPORTED && (
                         <>
                          <button 
                            onClick={() => handleAction((v._id || v.id || '') as string, ViolationStatus.VERIFIED, 15000)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Verify & Issue Fine"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction((v._id || v.id || '') as string, ViolationStatus.DISMISSED)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Dismiss Case"
                          >
                            <XCircle size={18} />
                          </button>
                         </>
                       )}
                       <button className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="View Details">
                          <ExternalLink size={18} />
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No registry entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
