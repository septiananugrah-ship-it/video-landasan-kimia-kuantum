import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Stage} from './components/primitives';
import {fringe} from './components/qm';
import {DotScreen} from './scenes/Hook';
import {C, FONT, H, W} from './theme';

/** Gambar sampul video (2560×1440 lewat skala 4/3, lihat Root.tsx). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 70% 45%, #2c1a5a 0%, ${C.bg2} 45%, ${C.bg} 100%)`}}>
    <Stage>
      <Glow x={1400} y={470} r={560} color="violet" opacity={0.22} />
      <rect x={1000} y={170} width={800} height={560} rx={12} fill="rgba(6,10,24,0.85)" stroke={C.faint} strokeWidth={3} />
      <DotScreen count={5200} x={1000} y={170} w={800} h={560} />
      <path
        d={Array.from({length: 241}, (_, k) => `${k ? 'L' : 'M'}${1000 + (k / 240) * 800},${700 - fringe(k / 240) * 330}`).join(' ')}
        fill="none"
        stroke={C.gold}
        strokeWidth={8}
        filter="url(#glow)"
      />
      <text x={1400} y={860} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={110} fill={C.gold}>
        |ψ|²
      </text>
    </Stage>
    <div style={{position: 'absolute', left: 110, top: 220, width: 900}}>
      <div style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: 8, color: C.gold}}>KIMIA KUANTUM · MODUL 2</div>
      <div style={{fontFamily: FONT.sans, fontSize: 70, fontWeight: 800, color: C.ink, lineHeight: 1.05, marginTop: 10}}>Landasan Kimia Kuantum</div>
      <div style={{fontFamily: FONT.sans, fontSize: 140, fontWeight: 800, color: C.gold, lineHeight: 1, marginTop: 24, textShadow: '0 0 50px rgba(255,194,74,0.45)'}}>
        Aturan
        <br />
        Main Kuantum
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 44}}>
        {[
          ['fungsi gelombang', C.cyan],
          ['operator', C.violet],
          ['larangan Pauli', C.amber],
        ].map(([t, col]) => (
          <div key={t} style={{padding: '10px 22px', borderRadius: 999, border: `2px solid ${col}`, color: col, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30}}>
            {t}
          </div>
        ))}
      </div>
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${2560 / W})`, transformOrigin: '0 0'}}>
      <Cover />
    </div>
  </AbsoluteFill>
);
