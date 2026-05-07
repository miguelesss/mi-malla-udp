"use client";

import { useState, useEffect } from 'react';
import ramos from '../data/ramos.json';

export default function Home() {
  const [aprobados, setAprobados] = useState([]);

  useEffect(() => {
    const guardados = localStorage.getItem('malla-progreso');
    if (guardados) setAprobados(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem('malla-progreso', JSON.stringify(aprobados));
  }, [aprobados]);

  const toggleAprobado = (id) => {
    setAprobados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getColorArea = (id) => {
    if (id.startsWith('CBM') || id.startsWith('CBF') || id.startsWith('CBQ')) return '#3b82f6'; 
    if (id.startsWith('CII') || id.startsWith('CIT')) return '#eab308'; 
    if (id.startsWith('FIC') || id.startsWith('CFG') || id.startsWith('CIG')) return '#f97316'; 
    return '#64748b';
  };

  const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 font-sans select-none">
      <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 p-4 md:p-8">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-3xl font-black tracking-tighter text-white uppercase">
              Ingeniería Civil Industrial <span className="text-blue-500">UDP</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">
              GitHub: @miguelesss
            </p>
          </div>
          <div className="bg-blue-600/10 px-4 py-1.5 rounded-xl border border-blue-500/20">
            <span className="text-lg md:text-2xl font-black text-blue-400">
              {Math.round((aprobados.length / ramos.length) * 100)}%
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-4 md:p-8">
        <div className="flex gap-4 overflow-x-auto pb-10 snap-x snap-mandatory md:snap-none custom-scrollbar">
          {semestres.map((sem) => {
            const ramosSemestre = ramos.filter(r => r.semestre === sem);
            const totalCreditos = ramosSemestre.reduce((acc, r) => acc + r.creditos, 0);
            const aprobadosSem = ramosSemestre.filter(r => aprobados.includes(r.id)).reduce((acc, r) => acc + r.creditos, 0);

            return (
              <div key={sem} className="min-w-[85vw] md:min-w-[260px] flex-1 snap-center md:snap-align-none">
                <div className="mb-5 p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Semestre {sem}</h3>
                  <span className={`text-[10px] font-bold ${aprobadosSem === totalCreditos ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {aprobadosSem}/{totalCreditos} CR
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {ramosSemestre.map((ramo) => {
                    const esAprobado = aprobados.includes(ramo.id);
                    const colorArea = getColorArea(ramo.id);
                    const estaAbierto = ramo.prerrequisitos.every(p => aprobados.includes(p));
                    return (
                      <button key={ramo.id} onClick={() => toggleAprobado(ramo.id)}
                        className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 md:hover:scale-[1.02] ${esAprobado ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : estaAbierto ? 'bg-[#0f0f0f] border-white/10' : 'bg-white/5 border-transparent opacity-20 grayscale'}`}
                        style={!esAprobado && estaAbierto ? { borderLeftColor: colorArea, borderLeftWidth: '6px' } : {}}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[9px] font-black tracking-widest ${esAprobado ? 'text-emerald-400' : 'text-slate-600'}`}>{ramo.id}</span>
                          {esAprobado && <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
                        </div>
                        <h2 className="text-[11px] md:text-xs font-bold leading-tight mb-4 h-8 overflow-hidden uppercase">{ramo.nombre}</h2>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-700">{ramo.creditos} CR.</span>
                          {!esAprobado && estaAbierto && <span className="text-[9px] font-black text-blue-500/60 uppercase">Abierto</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar { height: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        }
        @media (max-width: 767px) {
          .custom-scrollbar::-webkit-scrollbar { display: none; }
          .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        }
      `}</style>
    </main>
  );
}