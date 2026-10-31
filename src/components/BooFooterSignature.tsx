import React from 'react';
import { BooLogo } from './BooLogo';

export const BooFooterSignature: React.FC = () => {
  return (
    <footer className="pt-4 pb-2 px-3 text-center border-t border-white/[0.06] mt-3">
      <p className="text-[10px] font-semibold text-gray-400 leading-relaxed tracking-tight flex items-center justify-center flex-wrap gap-x-1 gap-y-0.5">
        <span>© 2026</span>
        <span className="inline-flex items-center gap-1 font-extrabold text-white">
          <BooLogo className="h-3.5 w-auto inline-block shrink-0" />
          <span>Boo</span>
        </span>
        <span>·</span>
        <span>Une initiative du Groupe Mmedia Universe. Tous droits réservés.</span>
      </p>
    </footer>
  );
};
