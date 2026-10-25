import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Frac, Glow, Hbar, Op, Stage, V} from '../components/primitives';
import {fringe} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {DotScreen} from './Hook';

// Bab 18: enam aturan main mengelilingi ψ; lalu kembali ke layar titik elektron (pembuka).
const CX = 960;
const CY = 540;
const RAD = 250;
const NODES: {f: React.ReactNode; title: string; col: string}[] = [
  {f: '|ψ|²', title: 'keadaan', col: C.cyan},
  {f: 'Â', title: 'operator', col: C.violet},
  {f: 'Âφ = aφ', title: 'nilai eigen', col: C.gold},
  {f: '⟨A⟩', title: 'nilai harapan', col: C.mint},
  {
    f: (
      <>
        <V>i</V>
        <Hbar />
        <Frac n={<>∂<V>Ψ</V></>} d={<>∂<V>t</V></>} size={0.78} />
        &thinsp;= <Op>H</Op>
        <V>Ψ</V>
      </>
    ),
    title: 'Schrödinger',
    col: C.amber,
  },
  {f: 'Ψ(1,2) = −Ψ(2,1)', title: 'Pauli', col: C.red},
];
const pos = (i: number) => {
  const a = (-2 * Math.PI) / 3 + (i * Math.PI) / 3;
  return {x: CX + RAD * 1.45 * Math.cos(a), y: CY + RAD * Math.sin(a)};
};
const APPS = ['tabel periodik', 'ikatan kimia', 'spektrum', 'MRI'];

export const Recap: React.FC = () => {
  const {t, cue} = useScene();
  const intro = ramp(t, cue(0) - 0.3, cue(0) + 1);
  const out = ramp(t, cue(8) - 0.4, cue(8) + 0.8, EASE_IN_OUT);
  const lit = NODES.map((_, i) => ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.6, BACK));
  const apps = APPS.map((_, i) => ramp(t, cue(7) + 0.4 + i * 0.5, cue(7) + 1.0 + i * 0.5, BACK));
  // heksagon aturan hilang dulu, baru layar titik elektron muncul (tidak bertumpuk)
  const screen = ramp(t, cue(8) + 0.8, cue(8) + 1.6);
  const count = Math.floor(5200 * ramp(t, cue(8) + 1.0, cue(8) + 5.0, EASE_IN_OUT));
  const curve = ramp(t, cue(8) + 3.6, cue(8) + 5.0);
  const S = {x: 460, y: 250, w: 1000, h: 560};
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={intro * (1 - out)}>
          <Glow x={CX} y={CY} r={260} color="violet" opacity={0.25} />
          {NODES.map((_, i) => {
            const p = pos(i);
            const q = pos((i + 1) % 6);
            return <line key={`l${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.gold} strokeWidth={2} opacity={0.15 + 0.5 * Math.min(lit[i], lit[(i + 1) % 6])} />;
          })}
          {NODES.map((n, i) => {
            const p = pos(i);
            return (
              <g key={i} opacity={0.25 + 0.75 * lit[i]}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={n.col} strokeWidth={2} strokeDasharray="6 8" opacity={0.4 * lit[i]} />
                <circle cx={p.x} cy={p.y} r={74} fill="rgba(12,18,40,0.92)" stroke={n.col} strokeWidth={3} />
                <text x={p.x} y={p.y - 12} textAnchor="middle" fontFamily={FONT.mono} fontSize={36} fontWeight={600} fill={n.col}>
                  {i + 1}
                </text>
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={86} fill="rgba(12,18,40,0.95)" stroke={C.violet} strokeWidth={3} />
          <text x={CX} y={CY + 22} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={80} fill={C.violet}>
            Ψ
          </text>
        </g>
        {/* kembali ke layar elektron */}
        <g opacity={screen}>
          <rect x={S.x} y={S.y} width={S.w} height={S.h} rx={10} fill="rgba(6,10,24,0.88)" stroke={C.faint} strokeWidth={3} />
          <DotScreen count={count} x={S.x} y={S.y} w={S.w} h={S.h} />
          <path
            d={Array.from({length: 241}, (_, k) => `${k ? 'L' : 'M'}${(S.x + (k / 240) * S.w).toFixed(1)},${(S.y + S.h - 30 - fringe(k / 240) * 300).toFixed(1)}`).join(' ')}
            fill="none"
            stroke={C.violet}
            strokeWidth={6}
            filter="url(#glow)"
            opacity={curve}
          />
          <rect x={S.x + S.w / 2 - 70} y={S.y + 18} width={140} height={60} rx={14} fill="rgba(6,10,24,0.85)" stroke={C.violet} strokeWidth={2} opacity={curve} />
          <text x={S.x + S.w / 2} y={S.y + 64} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={44} fill={C.violet} opacity={curve}>
            |ψ|²
          </text>
        </g>
      </Stage>
      {/* label node (HTML agar rumus & ⟨ ⟩ tampil benar) */}
      {NODES.map((n, i) => {
        const p = pos(i);
        const right = p.x > CX;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: right ? p.x + 92 : p.x - 92 - 420,
              top: p.y - 50,
              width: 420,
              textAlign: right ? 'left' : 'right',
              opacity: lit[i] * intro * (1 - out),
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: n.col}}>{n.title}</div>
            <div style={{fontFamily: FONT.serif, fontSize: 36, color: C.ink}}>{n.f}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', gap: 18, opacity: 1 - out}}>
        {APPS.map((a, i) => (
          <div
            key={a}
            style={{
              opacity: apps[i],
              transform: `scale(${0.7 + 0.3 * apps[i]})`,
              padding: '10px 24px',
              borderRadius: 999,
              border: `2px solid ${C.gold}`,
              color: C.gold,
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 28,
              background: 'rgba(40,30,8,0.6)',
            }}
          >
            {a}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
