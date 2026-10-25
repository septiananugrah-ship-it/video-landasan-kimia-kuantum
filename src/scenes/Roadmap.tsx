import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {PhaseWave, freePacket} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Peta video: tiga bagian wajib tugas.
const CARDS = [
  {n: '1', title: 'Prinsip & teori dasar', sub: 'ψ, operator, pengukuran, Schrödinger', color: C.cyan, x: 420},
  {n: '2', title: 'Implementasi dalam kimia', sub: 'konfigurasi, ikatan, spektroskopi', color: C.violet, x: 960},
  {n: '3', title: 'Penerapan di industri', sub: 'MRI, kimia komputasi, qubit', color: C.amber, x: 1500},
];
const Y = 560;

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) return <PhaseWave f={(u) => freePacket((u - 0.5) * 10, 0.2, -1 + ((t * 0.6) % 2), 0.9, 6)} x={x - 80} y={y + 30} w={160} sy={70} n={60} outline={false} />;
  if (i === 1) {
    // orbital ikatan H₂: dua inti + awan di antaranya
    return (
      <g>
        <ellipse cx={x} cy={y} rx={88} ry={42} fill={C.violet} opacity={0.25 + 0.1 * Math.sin(t * 2)} />
        <ellipse cx={x} cy={y} rx={56} ry={26} fill={C.violet} opacity={0.35} />
        {[-40, 40].map((dx) => (
          <circle key={dx} cx={x + dx} cy={y} r={12} fill="#f2f5ff" />
        ))}
      </g>
    );
  }
  // spin presesi (MRI/NMR)
  const a = t * 2.4;
  return (
    <g>
      <ellipse cx={x} cy={y - 34} rx={40} ry={12} fill="none" stroke={C.amber} strokeWidth={2} strokeDasharray="5 5" />
      <circle cx={x} cy={y + 14} r={18} fill={C.red} />
      <line x1={x} y1={y + 14} x2={x + 40 * Math.cos(a)} y2={y - 34 + 12 * Math.sin(a)} stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x + 40 * Math.cos(a)} cy={y - 34 + 12 * Math.sin(a)} r={6} fill={C.amber} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue} = useScene();
  const head = ramp(t, -0.2, 0.9);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', opacity: head, translate: `0px ${(1 - head) * 20}px`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: C.gold}}>TOPIK KAJIAN · MODUL 2</div>
        <div style={{fontFamily: FONT.sans, fontSize: 64, fontWeight: 700, color: C.ink, marginTop: 6}}>Landasan Kimia Kuantum</div>
      </div>
      <Stage>
        {CARDS.map((c, i) => {
          const p = ramp(t, cue(i + 1) - 0.2, cue(i + 1) + 0.6, BACK);
          const lit = ramp(t, cue(i + 1), cue(i + 1) + 0.4) * (i === 2 || t < cue(i + 2) ? 1 : 0.55);
          return (
            <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
              <Glow x={c.x} y={Y} r={260} color={(['cyan', 'violet', 'gold'] as const)[i]} opacity={0.18 * lit} />
              <rect x={c.x - 252} y={Y - 170} width={504} height={340} rx={28} fill="rgba(12,18,40,0.82)" stroke={c.color} strokeOpacity={0.35 + 0.5 * lit} strokeWidth={2.5} />
              <text x={c.x - 214} y={Y - 110} fontFamily={FONT.mono} fontSize={64} fontWeight={600} fill={c.color} dominantBaseline="central">
                {c.n}
              </text>
              <Icon i={i} x={c.x + 110} y={Y - 90} t={t} />
              <text x={c.x - 214} y={Y + 40} fontFamily={FONT.sans} fontSize={31} fontWeight={700} fill={C.ink}>
                {c.title}
              </text>
              <text x={c.x - 214} y={Y + 88} fontFamily={FONT.sans} fontSize={22} fill={C.muted}>
                {c.sub}
              </text>
            </g>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};
