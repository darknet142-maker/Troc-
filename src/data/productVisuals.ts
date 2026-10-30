// Ultra-HD Vector Studio Product Renders (800x800 1:1 Square, geometricPrecision)
// Infinite resolution when zoomed in the Product Inspector (1x / 2x / 4x).

function svgToDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const STUDIO_VISUALS = {
  // 1. Montre Connectée Series 6 (UHD Vector 1:1)
  smartwatch: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <radialGradient id="bg" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stop-color="#252936"/>
          <stop offset="65%" stop-color="#151821"/>
          <stop offset="100%" stop-color="#0b0d12"/>
        </radialGradient>
        <linearGradient id="case" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9ca3af"/>
          <stop offset="35%" stop-color="#4b5563"/>
          <stop offset="75%" stop-color="#1f2937"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#27272a"/>
          <stop offset="50%" stop-color="#3f3f46"/>
          <stop offset="100%" stop-color="#18181b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg)"/>
      <ellipse cx="400" cy="685" rx="185" ry="26" fill="#000" opacity="0.55"/>
      <!-- Back loop band -->
      <path d="M330 156 C480 130, 590 240, 590 400 C590 560, 480 650, 330 630" fill="none" stroke="#2d313b" stroke-width="88" stroke-linecap="round"/>
      <circle cx="564" cy="320" r="8" fill="#14161b"/>
      <circle cx="572" cy="370" r="8" fill="#14161b"/>
      <circle cx="572" cy="420" r="8" fill="#14161b"/>
      <circle cx="564" cy="470" r="8" fill="#14161b"/>
      <!-- Front straps -->
      <path d="M260 240 L284 132 Q340 108 400 132 L424 240 Z" fill="url(#band)"/>
      <path d="M260 550 L284 658 Q340 682 400 658 L424 550 Z" fill="url(#band)"/>
      <!-- Digital Crown & Side Button -->
      <rect x="468" y="302" width="24" height="58" rx="10" fill="url(#case)" stroke="#d1d5db" stroke-width="2.5"/>
      <circle cx="480" cy="331" r="6" fill="#ef4444"/>
      <rect x="470" y="396" width="14" height="64" rx="6" fill="#4b5563"/>
      <!-- Watch Aluminum Case -->
      <rect x="196" y="224" width="284" height="340" rx="72" fill="url(#case)" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Inner OLED Bezel -->
      <rect x="212" y="240" width="252" height="308" rx="58" fill="#050609" stroke="#334155" stroke-width="3"/>
      <!-- Specular glass highlight -->
      <path d="M222 252 Q338 248 450 264 L320 420 L220 380 Z" fill="#ffffff" opacity="0.04"/>
      <!-- Activity Rings -->
      <circle cx="338" cy="394" r="70" fill="none" stroke="#ef4444" stroke-width="13" stroke-dasharray="340 440" stroke-linecap="round"/>
      <circle cx="338" cy="394" r="52" fill="none" stroke="#84cc16" stroke-width="13" stroke-dasharray="250 360" stroke-linecap="round"/>
      <circle cx="338" cy="394" r="34" fill="none" stroke="#06b6d4" stroke-width="13" stroke-dasharray="170 240" stroke-linecap="round"/>
      <!-- Corner Complications -->
      <circle cx="254" cy="288" r="20" fill="#18181b" stroke="#f59e0b" stroke-width="3.5"/>
      <circle cx="422" cy="288" r="20" fill="#18181b" stroke="#ec4899" stroke-width="3.5"/>
      <circle cx="254" cy="500" r="20" fill="#18181b" stroke="#10b981" stroke-width="3.5"/>
      <circle cx="422" cy="500" r="20" fill="#18181b" stroke="#ef4444" stroke-width="3.5"/>
      <!-- Precision Watch Hands -->
      <line x1="338" y1="394" x2="294" y2="346" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
      <line x1="338" y1="394" x2="398" y2="354" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
      <line x1="338" y1="394" x2="338" y2="466" stroke="#ff6b00" stroke-width="4" stroke-linecap="round"/>
      <circle cx="338" cy="394" r="8" fill="#ff6b00"/>
    </svg>
  `),

  // 2. Enceinte Bluetooth JBL Rouge (UHD Vector 1:1)
  jblSpeaker: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <radialGradient id="bg2" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stop-color="#282c38"/>
          <stop offset="65%" stop-color="#151821"/>
          <stop offset="100%" stop-color="#0b0d12"/>
        </radialGradient>
        <linearGradient id="redBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ff5a4f"/>
          <stop offset="40%" stop-color="#e11d48"/>
          <stop offset="80%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#580e0e"/>
        </linearGradient>
        <pattern id="mesh" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.6" fill="#450a0a" opacity="0.55"/>
          <circle cx="12" cy="12" r="2.2" fill="#fecdd3" opacity="0.22"/>
        </pattern>
      </defs>
      <rect width="800" height="800" fill="url(#bg2)"/>
      <ellipse cx="400" cy="625" rx="290" ry="42" fill="#000" opacity="0.58"/>
      <g transform="rotate(7 400 410)">
        <rect x="220" y="524" width="350" height="32" rx="16" fill="#651111"/>
        <rect x="96" y="244" width="590" height="296" rx="90" fill="url(#redBody)"/>
        <rect x="96" y="244" width="590" height="296" rx="90" fill="url(#mesh)"/>
        <ellipse cx="128" cy="392" rx="44" ry="142" fill="#991b1b"/>
        <!-- Right Acoustic Radiator -->
        <ellipse cx="664" cy="392" rx="56" ry="146" fill="#ef4444" stroke="#fda4af" stroke-width="4"/>
        <ellipse cx="660" cy="392" rx="40" ry="108" fill="#881337" stroke="#4c0519" stroke-width="6"/>
        <ellipse cx="656" cy="392" rx="24" ry="68" fill="#e11d48"/>
        <!-- Center Metallic Badge -->
        <rect x="344" y="356" width="76" height="68" rx="10" fill="#e11d48" stroke="#fecdd3" stroke-width="3"/>
        <text x="382" y="400" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="26">JBL</text>
        <text x="290" y="276" fill="#7f1d1d" font-family="sans-serif" font-weight="900" font-size="28">+    -    ▶</text>
      </g>
    </svg>
  `),

  // 3. Micro Sans Fil Pro (UHD Vector 1:1)
  wirelessMic: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <radialGradient id="bg3" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stop-color="#252936"/>
          <stop offset="65%" stop-color="#14171f"/>
          <stop offset="100%" stop-color="#0b0d12"/>
        </radialGradient>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9ca3af"/>
          <stop offset="40%" stop-color="#374151"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="grille" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="55%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg3)"/>
      <ellipse cx="400" cy="680" rx="225" ry="28" fill="#000" opacity="0.52"/>
      <g transform="translate(400 400) rotate(42) translate(-400 -400)">
        <path d="M360 630 L440 630 L430 704 Q400 720 370 704 Z" fill="#1e293b"/>
        <path d="M336 280 L464 280 L440 636 L360 636 Z" fill="url(#micBody)" stroke="#64748b" stroke-width="2"/>
        <!-- Backlit OLED Screen -->
        <rect x="368" y="384" width="64" height="108" rx="10" fill="#050811" stroke="#475569" stroke-width="3.5"/>
        <text x="400" y="430" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="20">CH08</text>
        <text x="400" y="462" text-anchor="middle" fill="#34d399" font-family="monospace" font-weight="bold" font-size="18">UHF</text>
        <circle cx="400" cy="536" r="14" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="328" y="248" width="144" height="36" rx="6" fill="#cbd5e1"/>
        <rect x="328" y="258" width="144" height="10" fill="#0ea5e9"/>
        <!-- Steel Mesh Capsule -->
        <circle cx="400" cy="184" r="88" fill="url(#grille)" stroke="#e2e8f0" stroke-width="3"/>
        <path d="M316 184 Q400 210 484 184" fill="none" stroke="#0ea5e9" stroke-width="8"/>
        <path d="M330 144 Q400 168 470 144" fill="none" stroke="#475569" stroke-width="3" opacity="0.65"/>
        <path d="M330 224 Q400 248 470 224" fill="none" stroke="#475569" stroke-width="3" opacity="0.65"/>
      </g>
    </svg>
  `),

  // 4. Four Micro-ondes Silver (UHD Vector 1:1)
  microwave: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <radialGradient id="bg4" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stop-color="#262a36"/>
          <stop offset="65%" stop-color="#14171f"/>
          <stop offset="100%" stop-color="#0b0d12"/>
        </radialGradient>
        <linearGradient id="silverCase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg4)"/>
      <ellipse cx="400" cy="645" rx="310" ry="34" fill="#000" opacity="0.55"/>
      <rect x="130" y="596" width="48" height="24" rx="8" fill="#0f172a"/>
      <rect x="610" y="596" width="48" height="24" rx="8" fill="#0f172a"/>
      <rect x="88" y="204" width="624" height="400" rx="28" fill="url(#silverCase)" stroke="#f1f5f9" stroke-width="4"/>
      <rect x="108" y="224" width="448" height="360" rx="16" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
      <rect x="140" y="256" width="352" height="296" rx="16" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <path d="M150 264 L330 264 L230 544 L150 544 Z" fill="#ffffff" opacity="0.09"/>
      <rect x="520" y="244" width="28" height="320" rx="12" fill="url(#silverCase)" stroke="#475569" stroke-width="3"/>
      <rect x="572" y="224" width="116" height="360" rx="12" fill="#0f172a" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="630" cy="324" r="32" fill="#334155" stroke="#e2e8f0" stroke-width="5"/>
      <line x1="630" y1="324" x2="630" y2="296" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="630" cy="448" r="32" fill="#334155" stroke="#e2e8f0" stroke-width="5"/>
      <line x1="630" y1="448" x2="652" y2="430" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <rect x="588" y="524" width="84" height="36" rx="8" fill="#334155" stroke="#64748b" stroke-width="2"/>
    </svg>
  `),

  // 5. Casque Audio Studio Pro (UHD Vector 1:1)
  headphones: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <radialGradient id="bg5" cx="50%" cy="48%" r="58%">
          <stop offset="0%" stop-color="#2c231e"/>
          <stop offset="65%" stop-color="#14171f"/>
          <stop offset="100%" stop-color="#0b0d12"/>
        </radialGradient>
        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff944d"/>
          <stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg5)"/>
      <ellipse cx="400" cy="680" rx="220" ry="30" fill="#000" opacity="0.55"/>
      <path d="M204 440 C204 164, 596 164, 596 440" fill="none" stroke="#27272a" stroke-width="52" stroke-linecap="round"/>
      <path d="M224 410 C224 192, 576 192, 576 410" fill="none" stroke="url(#goldAccent)" stroke-width="12" stroke-linecap="round"/>
      <g transform="rotate(-12 244 496)">
        <rect x="172" y="384" width="116" height="212" rx="56" fill="#18181b" stroke="#71717a" stroke-width="6"/>
        <rect x="236" y="400" width="56" height="180" rx="28" fill="#27272a"/>
        <circle cx="216" cy="490" r="28" fill="none" stroke="#ff6b00" stroke-width="6"/>
      </g>
      <g transform="rotate(12 556 496)">
        <rect x="512" y="384" width="116" height="212" rx="56" fill="#18181b" stroke="#71717a" stroke-width="6"/>
        <rect x="508" y="400" width="56" height="180" rx="28" fill="#27272a"/>
        <circle cx="584" cy="490" r="28" fill="none" stroke="#ff6b00" stroke-width="6"/>
      </g>
    </svg>
  `),

  // 6. Sneakers Nike Air Max T.43 (UHD Vector 1:1)
  sneakers: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <ellipse cx="400" cy="630" rx="290" ry="32" fill="#000" opacity="0.55"/>
      <g transform="rotate(-8 400 420)">
        <path d="M110 516 L690 516 Q712 570 660 584 L136 584 Q90 570 110 516 Z" fill="#f8fafc"/>
        <rect x="164" y="536" width="136" height="28" rx="14" fill="#0f172a" stroke="#ef4444" stroke-width="4"/>
        <path d="M130 516 L156 290 Q230 280 296 350 L470 396 Q630 416 684 516 Z" fill="#dc2626"/>
        <path d="M130 516 L390 516 L350 410 L144 410 Z" fill="#18181b"/>
        <path d="M250 430 Q350 504 536 404 Q390 456 284 390 Z" fill="#ffffff"/>
      </g>
    </svg>
  `),

  // 7. Manette PS5 DualSense (UHD Vector 1:1)
  controller: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <ellipse cx="400" cy="656" rx="250" ry="32" fill="#000" opacity="0.55"/>
      <path d="M230 270 Q400 236 570 270 C660 330, 690 550, 600 604 C544 630, 510 510, 470 484 L330 484 C290 510, 256 630, 200 604 C110 550, 140 330, 230 270 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
      <path d="M276 410 L524 410 L484 496 L316 496 Z" fill="#0f172a"/>
      <path d="M296 268 L504 268 L484 372 L316 372 Z" fill="#e2e8f0" stroke="#38bdf8" stroke-width="5"/>
      <circle cx="328" cy="436" r="40" fill="#1e293b" stroke="#64748b" stroke-width="6"/>
      <circle cx="472" cy="436" r="40" fill="#1e293b" stroke="#64748b" stroke-width="6"/>
      <rect x="224" y="324" width="52" height="20" rx="4" fill="#64748b"/>
      <rect x="240" y="308" width="20" height="52" rx="4" fill="#64748b"/>
      <circle cx="552" cy="308" r="10" fill="#64748b"/>
      <circle cx="580" cy="336" r="10" fill="#64748b"/>
      <circle cx="552" cy="364" r="10" fill="#64748b"/>
      <circle cx="524" cy="336" r="10" fill="#64748b"/>
    </svg>
  `),

  // 8. iPhone 12 Pro 128Go (UHD Vector 1:1)
  smartphone: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff6b00"/>
          <stop offset="50%" stop-color="#7c2d12"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#12151c"/>
      <ellipse cx="400" cy="700" rx="190" ry="24" fill="#000" opacity="0.55"/>
      <rect x="216" y="130" width="256" height="510" rx="48" fill="#334155" stroke="#94a3b8" stroke-width="4"/>
      <rect x="236" y="150" width="108" height="108" rx="28" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
      <circle cx="264" cy="180" r="18" fill="#090d16" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="264" cy="228" r="18" fill="#090d16" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="312" cy="204" r="18" fill="#090d16" stroke="#cbd5e1" stroke-width="4"/>
      <rect x="328" y="164" width="256" height="510" rx="48" fill="#0f172a" stroke="#cbd5e1" stroke-width="5"/>
      <rect x="342" y="178" width="228" height="482" rx="38" fill="url(#phoneScreen)"/>
      <rect x="400" y="178" width="112" height="28" rx="12" fill="#0f172a"/>
    </svg>
  `),

  // 9. Sac à Dos Imperméable Tech
  backpack: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <ellipse cx="400" cy="690" rx="190" ry="28" fill="#000" opacity="0.55"/>
      <path d="M336 156 Q400 110 464 156" fill="none" stroke="#475569" stroke-width="20" stroke-linecap="round"/>
      <rect x="224" y="164" width="352" height="484" rx="76" fill="#1f2937" stroke="#64748b" stroke-width="5"/>
      <rect x="260" y="336" width="280" height="264" rx="44" fill="#111827" stroke="#475569" stroke-width="4"/>
      <line x1="284" y1="284" x2="516" y2="284" stroke="#ff6b00" stroke-width="8" stroke-linecap="round"/>
      <rect x="368" y="224" width="64" height="24" rx="6" fill="#ff6b00"/>
    </svg>
  `),

  // 10. Ring Light LED + Trépied 2m
  ringLight: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <line x1="400" y1="470" x2="400" y2="700" stroke="#64748b" stroke-width="20"/>
      <line x1="400" y1="610" x2="256" y2="720" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
      <line x1="400" y1="610" x2="544" y2="720" stroke="#475569" stroke-width="16" stroke-linecap="round"/>
      <circle cx="400" cy="304" r="164" fill="none" stroke="#fef08a" stroke-width="44" opacity="0.25"/>
      <circle cx="400" cy="304" r="152" fill="none" stroke="#ffffff" stroke-width="28"/>
      <rect x="368" y="248" width="64" height="116" rx="12" fill="#1f2937" stroke="#ff6b00" stroke-width="4"/>
    </svg>
  `),

  // 11. Écran Moniteur 27" Full HD
  monitor: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <defs>
        <linearGradient id="disp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="50%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#ff6b00"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#12151c"/>
      <rect x="376" y="530" width="48" height="104" fill="#475569"/>
      <path d="M260 634 L540 634 L510 654 L290 654 Z" fill="#64748b"/>
      <rect x="96" y="184" width="608" height="356" rx="20" fill="#0f172a" stroke="#64748b" stroke-width="6"/>
      <rect x="112" y="200" width="576" height="320" rx="8" fill="url(#disp)"/>
    </svg>
  `),

  // 12. PlayStation 4 Slim + 2 Jeux
  ps4Console: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <ellipse cx="400" cy="664" rx="270" ry="30" fill="#000" opacity="0.55"/>
      <polygon points="170,210 510,170 470,620 130,620" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <line x1="150" y1="410" x2="490" y2="390" stroke="#38bdf8" stroke-width="6"/>
      <rect x="470" y="350" width="184" height="270" rx="12" fill="#1d4ed8" stroke="#60a5fa" stroke-width="4"/>
      <rect x="484" y="396" width="156" height="196" rx="6" fill="#0f172a"/>
      <text x="562" y="504" text-anchor="middle" fill="#ff6b00" font-family="sans-serif" font-weight="900" font-size="32">FC 26</text>
    </svg>
  `),

  // 13. Tablette Graphique Wacom
  tablet: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <rect x="116" y="230" width="568" height="370" rx="32" fill="#1f2937" stroke="#94a3b8" stroke-width="5"/>
      <rect x="164" y="264" width="472" height="302" rx="12" fill="#111827" stroke="#475569" stroke-width="3"/>
      <line x1="290" y1="470" x2="590" y2="190" stroke="#ff6b00" stroke-width="18" stroke-linecap="round"/>
      <circle cx="290" cy="470" r="8" fill="#ffffff"/>
    </svg>
  `),

  // 14. Machine à Café Expresso
  coffeeMaker: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <rect x="230" y="156" width="340" height="490" rx="44" fill="#334155" stroke="#cbd5e1" stroke-width="4"/>
      <rect x="270" y="330" width="260" height="270" rx="20" fill="#0f172a"/>
      <circle cx="400" cy="244" r="44" fill="#1e293b" stroke="#ff6b00" stroke-width="6"/>
      <path d="M344 480 L456 480 L440 584 L360 584 Z" fill="#f8fafc"/>
    </svg>
  `),

  // 15. Clavier Mécanique RGB
  keyboard: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <rect x="84" y="284" width="632" height="244" rx="28" fill="#1e293b" stroke="#ff6b00" stroke-width="5"/>
      <rect x="112" y="316" width="576" height="44" rx="8" fill="#334155"/>
      <rect x="112" y="376" width="576" height="44" rx="8" fill="#334155"/>
      <rect x="112" y="436" width="380" height="48" rx="8" fill="#ff6b00"/>
      <rect x="508" y="436" width="180" height="48" rx="8" fill="#10b981"/>
    </svg>
  `),

  // 16. Blender Mixeur Pro
  blender: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" shape-rendering="geometricPrecision">
      <rect width="800" height="800" fill="#12151c"/>
      <rect x="284" y="460" width="232" height="196" rx="32" fill="#334155" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="400" cy="556" r="40" fill="#0f172a" stroke="#ff6b00" stroke-width="6"/>
      <path d="M300 170 L500 170 L472 460 L328 460 Z" fill="#38bdf8" opacity="0.35" stroke="#e2e8f0" stroke-width="6"/>
      <rect x="288" y="140" width="224" height="36" rx="12" fill="#1e293b"/>
    </svg>
  `)
};
