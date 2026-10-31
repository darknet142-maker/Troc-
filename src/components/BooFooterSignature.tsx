import React from 'react';
import { BooLogo } from './BooLogo';

export const BooFooterSignature: React.FC = () => {
  return (
    <footer className="pt-4 pb-2.5 px-3 text-center border-t border-white/[0.06] mt-3 space-y-0.5">
      {/* Ligne 1 : © 2026 + Mini Logo Boo uniquement (sans doublon texte) */}
      <div className="text-[11px] font-semibold text-gray-300 flex items-center justify-center gap-1.5">
        <span>© 2026</span>
        <BooLogo className="h-3.5 w-auto inline-block shrink-0" />
      </div>

      {/* Ligne 2 : Une initiative du Groupe Mmedia Universe (en gras) */}
      <p className="text-[10px] text-gray-400 leading-snug">
        Une initiative du Groupe <strong className="font-black text-white">Mmedia Universe</strong>.
      </p>

      {/* Ligne 3 : Tous droits réservés. */}
      <p className="text-[10px] text-gray-500 leading-snug">
        Tous droits réservés.
      </p>
    </footer>
  );
};
