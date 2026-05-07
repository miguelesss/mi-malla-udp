"use client";
import { useState, useEffect } from 'react';
import ramos from '../data/ramos.json';

export default function Home() {
  const [aprobados, setAprobados] = useState([]);

  useEffect(() => {
    const guardados = localStorage.getItem('malla-enfermeria');
    if (guardados) setAprobados(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem('malla-enfermeria', JSON.stringify(aprobados));
  }, [aprobados]);

  const toggleAprobado = (id) => {
    setAprobados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const porcentaje = Math.round((aprobados.length / (ramos.length || 1)) * 100);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 font-sans select-none">
      <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 p-3 md:p-6">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-base md:text-2xl font-black tracking-tighter text-white uppercase">
              Malla Interactiva <span className="text-cyan-400">Enfermería</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-1">@miguelesss</p>
          </div>
          <div className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
            <span className="text-sm md:text-xl font-black text-cyan-400">{porcentaje}%</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-2 md:p-6">
        <div className="flex gap-3 overflow-x-auto pb-6 snap-x snap-mandatory md:snap-none custom-scrollbar">
          {semestres.map((sem) => {
            const ramosSem = ramos.filter(r => r.semestre === sem);
            const aCr = ramosSem.filter(r => aprobados.includes(r.id)).length;
            return (
              <div key={sem} className="min-w-[80vw] md:min-w-[220px] flex-1 snap-center md:snap-align-none">
                <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                  <h3 className="font-black text-white uppercase text-[9px]">Semestre {sem}</h3>
                  <span className={`text-[9px] font-bold ${aCr === ramosSem.length ? 'text-cyan-400' : 'text-slate-500'}`}>{aCr}/{ramosSem.length} Ramos</span>
                </div>
                <div className="flex flex-col gap-2">
                  {ramosSem.map((r) => {
                    const ok = aprobados.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => toggleAprobado(r.id)}
                        className={`relative w-full text-left p-3 rounded-xl border-2 transition-all duration-150 active:scale-95 ${ok ? 'bg-cyan-500/10 border-cyan-500 shadow-sm' : 'bg-[#0f0f0f] border-white/10'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[8px] font-black ${ok ? 'text-cyan-400' : 'text-slate-600'}`}>{r.id}</span>
                          {ok && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]" />}
                        </div>
                        <h2 className="text-[10px] md:text-[11px] font-bold leading-tight uppercase h-7 overflow-hidden">{r.nombre}</h2>
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
        @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { height: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; } }
        @media (max-width: 767px) { .custom-scrollbar::-webkit-scrollbar { display: none; } }
      `}</style>
    </main>
  );
}