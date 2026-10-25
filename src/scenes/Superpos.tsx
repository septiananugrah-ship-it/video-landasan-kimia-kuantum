import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot, win} from '../anim';
import {Formula, Frac, Label, Stage, Sqrt, Sub, Sup, V} from '../components/primitives';
import {Phasor} from '../components/qm';
import {psi} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 3: superposisi, ortogonalitas, dan contoh C(2φ₁ + iφ₂).
const L = {x: 170, w: 460};
const ROW1 = 430;
const ROW2 = 650;
const R = {x: 860, y: 600, w: 880, sy: 95};

const path = (f: (u: number) => number, x: number, y: number, w: number, sy: number, n = 160) =>
  Array.from({length: n + 1}, (_, k) => `${k ? 'L' : 'M'}${(x + (k / n) * w).toFixed(1)},${(y - f(k / n) * sy).toFixed(1)}`).join(' ');

/** Area bertanda: bagian positif hijau, negatif merah. */
const signedArea = (f: (u: number) => number, sign: 1 | -1, n = 200) => {
  const pts: string[] = [];
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const v = f(u);
    const y = R.y - (sign > 0 ? Math.max(0, v) : Math.min(0, v)) * R.sy;
    pts.push(`${(R.x + u * R.w).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${R.x},${R.y} L${pts.join(' L')} L${R.x + R.w},${R.y} Z`;
};

export const Superpos: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const left = ramp(t, cue(0) + 0.2, cue(0) + 1.2) * (1 - ramp(t, cue(5) - 0.4, cue(5) + 0.2));
  const sumOn = win(t, cue(0) + 1.0, cue(2) + 0.2, 0.8, 0.6);
  // bobot superposisi bergeser pelan (menunjukkan "bentuk baru")
  const w2 = mix(0, 0.9, ramp(t, cue(1) - 0.2, cue(1) + 2.6, EASE_IN_OUT)) + 0.25 * Math.sin(Math.max(0, t - cue(1) - 2.6) * 0.8);
  const sumF = (u: number) => (psi(1, u) + w2 * psi(2, u)) / Math.sqrt(1 + w2 * w2);
  // panel kanan berganti: kurva jumlah hilang dulu, baru hasil kali φ₁φ₂ muncul (tidak bertumpuk)
  const prod = win(t, cue(2) + 0.85, cue(5) - 0.2, 0.8, 0.5);
  const cancel = ramp(t, wordOf(3, 'menghapus') - 0.4, wordOf(3, 'menghapus') + 0.8);
  const plane = ramp(t, cue(5) + 0.2, cue(5) + 1.2);
  const squares = ramp(t, cue(6) - 0.2, cue(6) + 1.0);
  const shrink = ramp(t, wordOf(6, 'akar') - 0.3, wordOf(6, 'akar') + 1.0, EASE_IN_OUT);
  const bars = ramp(t, cue(7) + 0.2, cue(7) + 1.4, BACK);
  const prodF = (u: number) => psi(1, u) * psi(2, u);
  // bidang kompleks
  const PC = {x: 700, y: 610};
  const unit = mix(150, 150 / Math.sqrt(5), shrink);
  return (
    <AbsoluteFill>
      <Stage>
        {/* φ₁ dan φ₂ */}
        <g opacity={left}>
          {[
            {n: 1, y: ROW1, col: C.gold},
            {n: 2, y: ROW2, col: C.cyan},
          ].map((r) => (
            <g key={r.n}>
              <line x1={L.x} y1={r.y} x2={L.x + L.w} y2={r.y} stroke={C.faint} strokeWidth={2} />
              <line x1={L.x} y1={r.y - 110} x2={L.x} y2={r.y + 110} stroke={C.ink} strokeWidth={4} opacity={0.6} />
              <line x1={L.x + L.w} y1={r.y - 110} x2={L.x + L.w} y2={r.y + 110} stroke={C.ink} strokeWidth={4} opacity={0.6} />
              <path d={path((u) => psi(r.n, u), L.x, r.y, L.w, 62)} fill="none" stroke={r.col} strokeWidth={5} />
              <Label x={L.x - 40} y={r.y - 60} size={34} color={r.col} font="serif" italic anchor="end">
                {`φ${r.n === 1 ? '₁' : '₂'}`}
              </Label>
            </g>
          ))}
          <Label x={L.x + L.w / 2} y={(ROW1 + ROW2) / 2} size={48} color={C.muted} weight={300}>
            {prod > 0.5 ? '×' : '+'}
          </Label>
        </g>
        {/* panel kanan: jumlah */}
        <g opacity={sumOn}>
          <line x1={R.x} y1={R.y} x2={R.x + R.w} y2={R.y} stroke={C.faint} strokeWidth={2} />
          {[R.x, R.x + R.w].map((x) => (
            <line key={x} x1={x} y1={R.y - 200} x2={x} y2={R.y + 120} stroke={C.ink} strokeWidth={5} />
          ))}
          <path d={path(sumF, R.x, R.y, R.w, R.sy)} fill="none" stroke={C.mint} strokeWidth={6} filter="url(#glow)" />
          <Label x={R.x + R.w / 2} y={R.y + 160} size={28} color={C.mint}>
            {`c₁φ₁ + c₂φ₂  ·  c₂/c₁ = ${w2.toFixed(2).replace('.', ',')}`}
          </Label>
        </g>
        {/* panel kanan: hasil kali φ₁φ₂ */}
        <g opacity={prod}>
          <line x1={R.x} y1={R.y} x2={R.x + R.w} y2={R.y} stroke={C.faint} strokeWidth={2} />
          {[R.x, R.x + R.w].map((x) => (
            <line key={x} x1={x} y1={R.y - 200} x2={x} y2={R.y + 200} stroke={C.ink} strokeWidth={5} />
          ))}
          <path d={signedArea(prodF, 1)} fill={C.mint} opacity={0.45 * (1 - 0.6 * cancel)} />
          <path d={signedArea(prodF, -1)} fill={C.red} opacity={0.45 * (1 - 0.6 * cancel)} />
          <path d={path(prodF, R.x, R.y, R.w, R.sy)} fill="none" stroke={C.ink} strokeWidth={4} />
          <Label x={R.x + R.w * 0.25} y={R.y - 150} size={40} color={C.mint} weight={700}>
            +
          </Label>
          <Label x={R.x + R.w * 0.75} y={R.y + 150} size={40} color={C.red} weight={700}>
            −
          </Label>
          <g opacity={cancel}>
            <rect x={R.x + R.w / 2 - 150} y={R.y - 270} width={300} height={64} rx={14} fill="rgba(12,18,40,0.9)" stroke={C.gold} strokeWidth={2} />
            <text x={R.x + R.w / 2} y={R.y - 238} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={30} fontWeight={600} fill={C.gold}>
              luas total = 0
            </text>
          </g>
          <Label x={R.x + R.w - 10} y={R.y - 230} size={30} color={C.ink} anchor="end" font="serif" italic>
            φ₁ · φ₂
          </Label>
        </g>
        {/* bidang kompleks untuk 2φ₁ + iφ₂ */}
        <g opacity={plane}>
          <line x1={PC.x - 360} y1={PC.y} x2={PC.x + 380} y2={PC.y} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <line x1={PC.x} y1={PC.y + 150} x2={PC.x} y2={PC.y - 300} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={PC.x + 400} y={PC.y + 30} size={24} color={C.muted}>
            Re
          </Label>
          <Label x={PC.x + 36} y={PC.y - 300} size={24} color={C.muted}>
            Im
          </Label>
          <g opacity={squares}>
            <rect x={PC.x} y={PC.y - 2 * unit} width={2 * unit} height={2 * unit} fill={C.gold} opacity={0.18} stroke={C.gold} strokeWidth={2} />
            <rect x={PC.x - unit} y={PC.y - unit} width={unit} height={unit} fill={C.cyan} opacity={0.22} stroke={C.cyan} strokeWidth={2} />
            <Label x={PC.x + unit} y={PC.y - unit} size={30} color={C.gold} weight={700} font="mono">
              {shrink > 0.5 ? '4/5' : '4'}
            </Label>
            <Label x={PC.x - unit / 2} y={PC.y - unit / 2} size={26} color={C.cyan} weight={700} font="mono">
              {shrink > 0.5 ? '1/5' : '1'}
            </Label>
          </g>
          <Phasor x={PC.x} y={PC.y} r={2 * unit} phi={0} color={C.gold} ring={false} width={6} />
          <Phasor x={PC.x} y={PC.y} r={unit} phi={Math.PI / 2} color={C.cyan} ring={false} width={6} />
          <Label x={PC.x + 2 * unit} y={PC.y + 36} size={30} color={C.gold} font="serif" italic>
            {shrink > 0.5 ? '2/√5' : '2'}
          </Label>
          <Label x={PC.x - unit / 2} y={PC.y - unit - 30} size={30} color={C.cyan} font="serif" italic>
            {shrink > 0.5 ? 'i/√5' : 'i'}
          </Label>
        </g>
        {/* peluang */}
        <g opacity={bars}>
          {[
            {p: 0.8, label: 'φ₁ : 4/5', col: C.gold},
            {p: 0.2, label: 'φ₂ : 1/5', col: C.cyan},
          ].map((b, i) => (
            <g key={i}>
              <rect x={1260 + i * 200} y={760 - 380 * b.p * bars} width={130} height={380 * b.p * bars} rx={10} fill={b.col} opacity={0.85} />
              <Label x={1325 + i * 200} y={800} size={28} color={b.col} weight={700} font="serif" italic>
                {b.label}
              </Label>
            </g>
          ))}
          <Label x={1425} y={330} size={28} color={C.ink}>
            peluang hasil ukur
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={250} p={slot(t, cue(0) + 0.3, cue(2) - 0.05)} accent={C.mint} caption="prinsip superposisi">
        <V>ψ</V>&nbsp;=&nbsp;<V>c</V>
        <Sub>1</Sub>
        <V>φ</V>
        <Sub>1</Sub>&nbsp;+&nbsp;<V>c</V>
        <Sub>2</Sub>
        <V>φ</V>
        <Sub>2</Sub>
      </Formula>
      <Formula x={960} y={250} p={slot(t, cue(3), cue(4) - 0.05)} accent={C.gold} caption="ortogonal: integral hasil kali = 0">
        <span style={{fontSize: '1.2em'}}>∫</span>
        <Sub>0</Sub>
        <Sup>L</Sup>&thinsp;<V>φ</V>
        <Sub>1</Sub>
        <V>φ</V>
        <Sub>2</Sub>&thinsp;<V>dx</V>&nbsp;=&nbsp;0
      </Formula>
      <Formula x={960} y={250} p={slot(t, cue(4) - 0.05, cue(5) - 0.05)} accent={C.gold} caption="ortonormal: δ = 1 bila m = n, 0 bila m ≠ n">
        ⟨<V>φ</V>
        <Sub>m</Sub>|<V>φ</V>
        <Sub>n</Sub>⟩&nbsp;=&nbsp;<V>δ</V>
        <Sub>mn</Sub>
      </Formula>
      <Formula x={1340} y={330} p={slot(t, cue(5), cue(6) - 0.05)} accent={C.violet} caption="contoh modul (basis ortonormal)">
        <V>ψ</V>&nbsp;=&nbsp;<V>C</V>(2<V>φ</V>
        <Sub>1</Sub>&nbsp;+&nbsp;<V>i</V>
        <V>φ</V>
        <Sub>2</Sub>)
      </Formula>
      <Formula x={1340} y={330} p={slot(t, cue(6) - 0.05, cue(7) - 0.05)} accent={C.violet} caption="|2|² + |i|² = 5">
        |<V>C</V>|<Sup>2</Sup>(4 + 1) = 1 ⇒ <V>C</V>&nbsp;=&nbsp;
        <Frac n="1" d={<Sqrt>5</Sqrt>} />
      </Formula>
    </AbsoluteFill>
  );
};
