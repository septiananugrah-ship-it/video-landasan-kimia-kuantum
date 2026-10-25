import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {PhaseWave, freePacket} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const Letters: React.FC<{text: string; t: number; start: number; step: number; style: React.CSSProperties}> = ({text, t, start, step, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', ...style}}>
    {text.split('').map((ch, i) => {
      const p = ramp(t, start + i * step, start + i * step + 0.9);
      return (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, translate: `0px ${(1 - p) * 40}px`, filter: `blur(${(1 - p) * 12}px)`}}>
          {ch}
        </span>
      );
    })}
  </div>
);

export const Title: React.FC = () => {
  const {t} = useScene();
  const wave = ramp(t, 0.1, 2.0, EASE_IN_OUT);
  const sub = ramp(t, 2.6, 3.6);
  const line = ramp(t, 1.8, 3.2, EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Stage>
        <Glow x={960} y={500} r={640} color="violet" opacity={0.16 * wave} />
        <g opacity={0.38 * wave}>
          <PhaseWave f={(u) => freePacket((u - 0.5) * 24, 0.25 + t * 0.12, -6 + t * 0.3, 1.6, 4)} x={160} y={840} w={1600} sy={150} n={240} outline={false} mirror />
        </g>
      </Stage>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 120}}>
        <div style={{position: 'relative', textAlign: 'center'}}>
          <Letters text="LANDASAN KIMIA KUANTUM" t={t} start={0.4} step={0.03} style={{fontFamily: FONT.sans, fontWeight: 300, fontSize: 52, letterSpacing: 14, color: C.ink, marginRight: -14}} />
          <Letters
            text="ATURAN MAIN KUANTUM"
            t={t}
            start={0.9}
            step={0.05}
            style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 108, letterSpacing: 3, lineHeight: 1.08, color: C.gold, textShadow: '0 0 60px rgba(255,194,74,0.45)'}}
          />
        </div>
        <div style={{width: 640 * line, height: 2, margin: '30px 0 24px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 36, color: C.muted, letterSpacing: 1, opacity: sub, translate: `0px ${(1 - sub) * 16}px`}}>
          Kimia Kuantum · Modul 2 — fungsi gelombang, operator &amp; pengukuran
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
