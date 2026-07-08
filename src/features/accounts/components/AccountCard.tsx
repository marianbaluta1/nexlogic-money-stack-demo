import React from 'react';
import { MoreVertical } from 'lucide-react';

interface AccountCardProps {
  name: string;
  type: string;
  balance: number;
  bank: string;
}

export const AccountCard: React.FC<AccountCardProps> = ({ name, type, balance, bank }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-200 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-500/10 p-2 rounded-lg">
          <div className="w-6 h-6 bg-blue-500 rounded-full" />
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      <h3 className="text-slate-100 font-medium">{name}</h3>
      <p className="text-slate-500 text-sm">{bank} • {type}</p>
      <div className="mt-4">
        <span className="text-2xl font-bold text-white">{balance.toLocaleString()} RON</span>
      </div>
    </div>
  );
};