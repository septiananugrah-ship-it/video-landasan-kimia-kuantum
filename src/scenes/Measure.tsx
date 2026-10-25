import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, win} from '../anim';
import {Badge, Formula, Frac, Label, Stage, Sqrt, Sub, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 6: pengukuran. Keadaan √(3/4) ψ1s + (i/2) ψ2s diukur berulang kali → histogram 3/4 : 1/4,
// lalu runtuh ke ψ1s dan pengukuran ulang selalu memberi E1s.
const ST = {x: 390, y: 560};
const DET = {x: 880, y: 560};
const BIN = [
  {x: 1300, label: 'E₁ₛ = −13,6 eV', col: C.cyan},
  {x: 1620, label: 'E₂ₛ = −3,4 eV', col: C.violet},
];
const BASE = 790;
const MAXH = 330;

/** Awan orbital skematis: 1s (bola) atau 2s (inti + kulit luar dengan simpul). */
export const Orb: React.FC<{x: number; y: number; kind: '1s' | '2s'; s?: number; opacity?: number; t?: number}> = ({x, y, kind, s = 1, opacity = 1, t = 0}) => (
  <g opacity={opacity} transform={`translate(${x} ${y}) scale(${s})`}>
    {kind === '1s' ? (
      <>
        <circle r={70} fill="url(#soft-cyan)" opacity={0.9} />
        <circle r={36} fill="url(#soft-white)" opacity={0.5} />
      </>
    ) : (
      <>
        <circle r={96} fill="none" stroke={C.violet} strokeWidth={34} opacity={0.35} filter="url(#blur-soft)" />
        <circle r={96} fill="none" stroke={C.violet} strokeWidth={12} opacity={0.5 + 0.1 * Math.sin(t * 2)} />
        <circle r={60} fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="5 6" opacity={0.7} />
        <circle r={30} fill="url(#soft-violet)" opacity={0.9} />
      </>
    )}
    <circle r={5} fill={C.gold} />
  </g>
);

// hasil tiap percobaan (deterministik): true = 1s dengan peluang 3/4
const N_TRIALS = 120;
const RESULTS = Array.from({length: N_TRIALS}, (_, k) => rand(k * 4.17 + 0.9) < 0.75);

export const Measure: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const state = ramp(t, cue(0) + 0.2, cue(0) + 1.2);
  const coef = ramp(t, cue(1) + 0.4, cue(1) + 1.4);
  const det = ramp(t, cue(2) - 0.3, cue(2) + 0.6);
  // percobaan: dari baris 2 sampai baris 6, makin cepat
  const tA = cue(2) + 1.2;
  const tB = cue(6) - 0.4;
  const prog = ramp(t, tA, tB, (x) => x * x * 0.6 + x * 0.4);
  const n = Math.floor(prog * N_TRIALS);
  const counts = [0, 0];
  for (let k = 0; k < n; k++) counts[RESULTS[k] ? 0 : 1]++;
  const total = Math.max(1, counts[0] + counts[1]);
  const collapse = ramp(t, wordOf(6, 'runtuh') - 0.2, wordOf(6, 'runtuh') + 1.0, EASE_IN_OUT);
  const again = ramp(t, cue(7), cue(7) + 0.4);
  const extra = Math.floor(Math.max(0, t - cue(7) - 0.3) / 0.45);
  const fresh = (t - tA) / ((tB - tA) / N_TRIALS);
  const lastRes = n > 0 ? RESULTS[n - 1] : true;
  const flash = n > 0 && t < tB ? Math.max(0, 1 - ((fresh % 1) * 2.2)) * (n < 30 ? 1 : 0.5) : 0;
  const s2 = mix(1, 0, collapse);
  const s1 = mix(1, 1.25, collapse);
  return (
    <AbsoluteFill>
      <Stage>
        {/* keadaan sebelum ukur */}
        <g opacity={state}>
          <rect x={ST.x - 250} y={ST.y - 210} width={500} height={420} rx={26} fill="rgba(12,18,40,0.75)" stroke={C.faint} strokeWidth={2} />
          <Orb x={ST.x - 110 + 110 * collapse} y={ST.y - 10} kind="1s" s={s1} />
          <Orb x={ST.x + 110} y={ST.y - 10} kind="2s" s={0.8 * s2 + 0.001} opacity={s2} t={t} />
          <g opacity={coef * (1 - collapse)}>
            <Label x={ST.x - 110} y={ST.y + 140} size={30} color={C.cyan} font="serif" italic>
              √(3/4)
            </Label>
            <Label x={ST.x + 110} y={ST.y + 140} size={30} color={C.violet} font="serif" italic>
              i/2
            </Label>
            <Label x={ST.x} y={ST.y - 10} size={44} color={C.muted} weight={300}>
              +
            </Label>
          </g>
          <Label x={ST.x} y={ST.y - 180} size={26} color={collapse > 0.5 ? C.cyan : C.muted}>
            {collapse > 0.5 ? 'setelah diukur: ψ = ψ₁ₛ' : 'keadaan superposisi'}
          </Label>
        </g>
        {/* detektor */}
        <g opacity={det}>
          <line x1={ST.x + 260} y1={DET.y} x2={DET.x - 110} y2={DET.y} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <rect x={DET.x - 100} y={DET.y - 90} width={200} height={180} rx={22} fill="rgba(14,20,44,0.95)" stroke={C.gold} strokeWidth={3} />
          <circle cx={DET.x} cy={DET.y - 20} r={34} fill={lastRes ? C.cyan : C.violet} opacity={0.2 + 0.8 * flash} filter="url(#glow)" />
          <text x={DET.x} y={DET.y + 52} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fill={C.muted}>
            ukur E
          </text>
          {BIN.map((b, i) => (
            <path key={i} d={`M${DET.x + 100},${DET.y} C${DET.x + 220},${DET.y} ${b.x - 160},${BASE - 40} ${b.x - 90},${BASE - 40}`} fill="none" stroke={b.col} strokeWidth={2} strokeDasharray="6 8" opacity={0.45} />
          ))}
        </g>
        {/* histogram */}
        <g opacity={det}>
          <line x1={1160} y1={BASE} x2={1780} y2={BASE} stroke={C.muted} strokeWidth={2} />
          {BIN.map((b, i) => {
            const frac = counts[i] / total;
            const h = n ? frac * MAXH : 0;
            return (
              <g key={i}>
                <rect x={b.x - 80} y={BASE - h} width={160} height={h} rx={10} fill={b.col} opacity={0.85} />
                <line x1={b.x - 100} y1={BASE - (i === 0 ? 0.75 : 0.25) * MAXH} x2={b.x + 100} y2={BASE - (i === 0 ? 0.75 : 0.25) * MAXH} stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" opacity={ramp(t, cue(4), cue(4) + 0.8)} />
                <Label x={b.x} y={BASE + 34} size={26} color={b.col} weight={600}>
                  {b.label}
                </Label>
                <Label x={b.x} y={BASE - h - 30} size={28} color={C.ink} font="mono" opacity={n ? 1 : 0}>
                  {`${counts[i]}`}
                </Label>
              </g>
            );
          })}
          <Label x={1470} y={400} size={26} color={C.muted} opacity={n ? 1 : 0}>
            {`${n} kali pengukuran`}
          </Label>
        </g>
        {/* pengukuran ulang setelah runtuh */}
        <g opacity={again}>
          {Array.from({length: Math.min(6, extra)}, (_, k) => (
            <g key={k}>
              <circle cx={DET.x - 60 + k * 24} cy={DET.y + 130} r={9} fill={C.cyan} />
            </g>
          ))}
          <Label x={DET.x} y={DET.y + 175} size={26} color={C.cyan} weight={700}>
            selalu E₁ₛ
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={250} p={win(t, cue(1) + 0.2, cue(3) - 0.1, 0.7, 0.4)} accent={C.gold} caption="peluang hasil ukur aₙ (eigenbasis tak terdegenerasi)">
        <V>ψ</V>&nbsp;=&nbsp;Σ&thinsp;<V>c</V>
        <Sub>n</Sub>
        <V>φ</V>
        <Sub>n</Sub>&nbsp;&nbsp;⇒&nbsp;&nbsp;<V>P</V>(<V>a</V>
        <Sub>n</Sub>)&nbsp;=&nbsp;|<V>c</V>
        <Sub>n</Sub>|<Sup>2</Sup>
      </Formula>
      <Formula x={960} y={250} p={win(t, cue(3), cue(5) - 0.1, 0.7, 0.4)} accent={C.cyan} caption="contoh modul: atom hidrogen">
        <V>ψ</V>&nbsp;=&nbsp;
        <Sqrt>
          <Frac n="3" d="4" size={0.7} />
        </Sqrt>
        &thinsp;<V>ψ</V>
        <Sub>1s</Sub>&nbsp;+&nbsp;
        <Frac n={<V>i</V>} d="2" />
        <V>ψ</V>
        <Sub>2s</Sub>
      </Formula>
      <Badge x={960} y={250} text="SATU HASIL: ACAK · STATISTIK: PASTI" color={C.gold} opacity={win(t, cue(5), cue(6) - 0.1, 0.5, 0.4) * ramp(t, cue(5), cue(5) + 0.6, BACK)} />
      <Badge x={960} y={250} text="KEADAAN RUNTUH KE FUNGSI EIGEN" color={C.cyan} opacity={ramp(t, cue(6), cue(6) + 0.6)} />
    </AbsoluteFill>
  );
};
