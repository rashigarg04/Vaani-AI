import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Database, Cpu } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';

export const StatusBadge = () => {
  const { systemHealth } = useChat();

  const prismaStatus = systemHealth?.services?.gnaniPrisma?.configured;
  const timbreStatus = systemHealth?.services?.gnaniTimbre?.configured;
  const dbStatus = systemHealth?.services?.database;
  const aiProvider = systemHealth?.services?.aiReasoning;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full text-xs">
      {/* Gnani Prisma STT */}
      <div className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${prismaStatus ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <div>
            <div className="font-semibold text-gray-800 text-[11px]">Prisma STT</div>
            <div className="text-[10px] text-gray-500">v3.0 Multilingual</div>
          </div>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${prismaStatus ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {prismaStatus ? 'Ready' : 'Setup Key'}
        </span>
      </div>

      {/* Gnani Timbre TTS */}
      <div className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${timbreStatus ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          <div>
            <div className="font-semibold text-gray-800 text-[11px]">Timbre TTS</div>
            <div className="text-[10px] text-gray-500">v3.0 Expressive</div>
          </div>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${timbreStatus ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {timbreStatus ? 'Ready' : 'Setup Key'}
        </span>
      </div>

      {/* AI Reasoning */}
      <div className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-gray-800 text-[11px] truncate">
              {aiProvider?.name?.split(' ')[0] || 'Reasoning'}
            </div>
            <div className="text-[10px] text-gray-500 truncate">
              {aiProvider?.id === 'local_intelligent' ? 'Indian Context' : 'Hosted LLM'}
            </div>
          </div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-purple-50 text-purple-700 shrink-0">
          Active
        </span>
      </div>

      {/* Database Mode */}
      <div className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-gray-800 text-[11px]">Storage</div>
            <div className="text-[10px] text-gray-500 truncate">
              {dbStatus?.connected ? 'MongoDB' : 'Guest Mode'}
            </div>
          </div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 shrink-0">
          Online
        </span>
      </div>
    </div>
  );
};
