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
    setAprobados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
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
      <header className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 p-3 md:p-6">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-base md:text-2xl font-black tracking-tighter text-white uppercase leading-none">
              Ingeniería Civil Industrial <span className="text-blue-500">UDP</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-1">@miguelesss</p>
          </div>
          <div className="bg-blue-600/10 px-3 py-1 rounded-lg border border-blue-500/20">
            <span className="text-sm md:text-xl font-black text-blue-400">{Math.round((aprobados.length / (ramos.length || 1)) * 100)}%</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-2 md:p-6">
        <div className="flex gap-3 overflow-x-auto pb-6 snap-x snap-mandatory md:snap-none custom-scrollbar">
          {semestres.map((sem) => {
            const ramosSem = ramos.filter(r => r.semestre === sem);
            const tCr = ramosSem.reduce((acc, r) => acc + r.creditos, 0);
            const aCr = ramosSem.filter(r => aprobados.includes(r.id)).reduce((acc, r) => acc + r.creditos, 0);
            return (
              <div key={sem} className="min-w-[80vw] md:min-w-[220px] flex-1 snap-center md:snap-align-none">
                <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
                  <h3 className="font-black text-white uppercase text-[9px] tracking-widest">Sem. {sem}</h3>
                  <span className={`text-[9px] font-bold ${aCr === tCr ? 'text-emerald-400' : 'text-slate-500'}`}>{aCr}/{tCr} CR</span>
                </div>
                <div className="flex flex-col gap-2">
                  {ramosSem.map((r) => {
                    const ok = aprobados.includes(r.id);
                    const open = r.prerrequisitos.every(p => aprobados.includes(p));
                    return (
                      <button key={r.id} onClick={() => toggleAprobado(r.id)}
                        className={`relative w-full text-left p-2.5 rounded-xl border-2 transition-all duration-150 active:scale-95 ${ok ? 'bg-emerald-500/10 border-emerald-500' : open ? 'bg-[#0f0f0f] border-white/10' : 'bg-white/5 border-transparent opacity-20'}`}
                        style={!ok && open ? { borderLeftColor: getColorArea(r.id), borderLeftWidth: '5px' } : {}}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-[8px] font-black tracking-widest ${ok ? 'text-emerald-400' : 'text-slate-600'}`}>{r.id}</span>
                          {ok && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />}
                        </div>
                        <h2 className="text-[10px] md:text-[11px] font-bold leading-tight mb-1 h-7 overflow-hidden uppercase tracking-tight text-slate-100">
                          {r.nombre}
                        </h2>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-slate-700">{r.creditos} CR.</span>
                          {!ok && open && <span className="text-[8px] font-black text-blue-500/40 uppercase">Abierto</span>}
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
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @media (max-width: 767px) { .custom-scrollbar::-webkit-scrollbar { display: none; } }
      `}</style>
    </main>
  );
}