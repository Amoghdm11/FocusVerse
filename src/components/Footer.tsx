import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#2A244D] bg-[#080610] py-3 px-6 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 select-none z-30 relative">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-arcade-gold animate-pulse inline-block" />
        <span className="font-pixel text-[10px] text-gray-300 tracking-wider">
          FOCUS<span className="text-arcade-gold">VERSE</span>
        </span>
        <span className="text-gray-600">//</span>
        <span className="text-[11px] text-gray-400">PIXEL PRODUCTIVITY SANCTUARY</span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] flex-wrap justify-center">
        <span>Crafted with</span>
        <Heart size={12} className="text-arcade-pink fill-arcade-pink inline animate-pulse" />
        <span className="text-gray-600">•</span>
        <span className="text-gray-400">Credits:</span>
        <strong className="text-arcade-gold font-bold hover:text-white transition-colors cursor-default">
          AmorSin
        </strong>
        <span className="text-gray-500">,</span>
        <strong className="text-arcade-cyan font-bold hover:text-white transition-colors cursor-default">
          Beezsy79
        </strong>
        <span className="text-gray-500">,</span>
        <strong className="text-arcade-purple font-bold hover:text-white transition-colors cursor-default">
          Amoghdm11
        </strong>
        <span className="text-arcade-gold font-bold">&amp;</span>
        <strong className="text-arcade-gold font-bold hover:text-white transition-colors cursor-default">
          02Yuzu02
        </strong>
      </div>
    </footer>
  );
};
