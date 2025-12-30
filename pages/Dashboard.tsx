
import React, { useState, useEffect } from 'react';
import { User, Violation, ViolationStatus } from '../types';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle, AlertCircle, TrendingUp, IndianRupee, Loader2 } from 'lucide-react';
import { INDIAN_CURRENCY } from '../constants';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/violations');
        setViolations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-500">
        <div className="relative">
          <Loader2 className="animate-spin text-orange-500" size={48} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700">Connecting to Enforcement Engine</p>
          <p className="text-xs">Synchronizing with National Database...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Reports', value: violations.length, icon: AlertCircle, color: 'blue' },
    { label: 'Verified', value: violations.filter(v => v.status === ViolationStatus.VERIFIED).length, icon: CheckCircle, color: 'green' },
    { label: 'Pending Notice', value: violations.filter(v => v.status === ViolationStatus.REPORTED).length, icon: Clock, color: 'amber' },
    { label: 'Fines Collected', value: violations.filter(v => v.status === ViolationStatus.PAID).reduce((acc, v) => acc + (v.fineAmount || 0), 0), icon: IndianRupee, color: 'indigo', isCurrency: true },
  ];

  const chartData = [
    { name: 'Reported', value: violations.filter(v => v.status === ViolationStatus.REPORTED).length },
    { name: 'Review', value: violations.filter(v => v.status === ViolationStatus.UNDER_REVIEW).length },
    { name: 'Verified', value: violations.filter(v => v.status === ViolationStatus.VERIFIED).length },
    { name: 'Paid', value: violations.filter(v => v.status === ViolationStatus.PAID).length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Welcome, {user.name}</h3>
        <p className="text-slate-500">Enforcement Oversight • <span className="text-green-600 font-medium">System Online</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-orange-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">{stat.label}</p>
              <h4 className="text-2xl font-bold mt-1">
                {stat.isCurrency && INDIAN_CURRENCY}
                {stat.value.toLocaleString()}
              </h4>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            System Lifecycle Overview
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h4 className="font-bold text-slate-700 mb-6">Recent Enforcement Files</h4>
           <div className="space-y-4">
             {violations.slice(0, 4).map((v) => (
               <div key={v._id || v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden border border-slate-200">
                       <img src={v.evidenceUrls[0] || 'https://picsum.photos/40/40'} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{v.title}</p>
                      <p className="text-xs text-slate-500">{new Date(v.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    v.status === ViolationStatus.REPORTED ? 'bg-amber-100 text-amber-700' :
                    v.status === ViolationStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {v.status.replace('_', ' ')}
                  </span>
               </div>
             ))}
             {violations.length === 0 && (
               <div className="text-center py-12">
                 <p className="text-slate-400">No records found in database.</p>
                 <a href="#/report" className="text-orange-600 text-sm font-bold mt-2 inline-block">Report One Now</a>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
