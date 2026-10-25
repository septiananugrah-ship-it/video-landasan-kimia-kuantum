import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, win} from '../anim';
import {Atom, Badge, Bond, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 16: kimia komputasi. Molekul kafein (skematis) → fungsi basis Gauss → iterasi energi
// menurun hingga konvergen → rapat elektron (DFT) → penyaringan kandidat di industri.
const S = 92; // panjang ikatan (px)
const MC = {x: 560, y: 540};
const hex = (k: number) => [Math.cos(((30 + 60 * k) * Math.PI) / 180), Math.sin(((30 + 60 * k) * Math.PI) / 180)] as const;
// kerangka kafein (posisi relatif, satuan panjang ikatan); unsur sesuai kafein
const ATOMS: {p: readonly [number, number]; el: string}[] = [
  {p: hex(0), el: 'C'},
  {p: hex(1), el: 'C'},
  {p: hex(2), el: 'N'},
  {p: hex(3), el: 'C'},
  {p: hex(4), el: 'N'},
  {p: hex(5), el: 'C'},
  {p: [1.68, 0.95], el: 'N'},
  {p: [2.25, 0], el: 'C'},
  {p: [1.68, -0.95], el: 'N'},
  {p: [0, 2], el: 'O'},
  {p: [-1.73, -1], el: 'O'},
  {p: [-1.73, 1], el: 'C'},
  {p: [0, -2], el: 'C'},
  {p: [2.1, 1.95], el: 'C'},
];
const BONDS: [number, number, number][] = [
  [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 2], [0, 6, 1], [6, 7, 1], [7, 8, 2], [8, 5, 1],
  [1, 9, 2], [3, 10, 2], [2, 11, 1], [4, 12, 1], [6, 13, 1],
];
const ap = (i: number) => ({x: MC.x + ATOMS[i].p[0] * S, y: MC.y - ATOMS[i].p[1] * S});
const g = (u: number, c: number, w: number) => Math.exp(-(((u - c) / w) ** 2));

export const CompChem: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const mol = ramp(t, cue(0) + 0.2, cue(0) + 1.2) * (1 - ramp(t, cue(5) - 0.5, cue(5)));
  const pencil = win(t, cue(0) + 0.6, cue(1) + 0.3, 0.5, 0.5);
  const basis = ramp(t, cue(2) - 0.2, cue(2) + 1.2);
  const sumP = ramp(t, cue(2) + 1.4, cue(2) + 2.8, EASE_IN_OUT);
  const iter = ramp(t, wordOf(2, 'diminimalkan') - 0.6, cue(3) + 1.0, EASE_IN_OUT);
  const dft = ramp(t, cue(3) + 0.2, cue(3) + 1.6);
  const funnel = ramp(t, cue(5) + 0.2, cue(5) + 1.2);
  const flow = ramp(t, cue(5) + 1.0, cue(5) + 6.5);
  const N_IT = 9;
  const E = (k: number) => -680 + 160 * Math.exp(-k / 1.3) + 10 * Math.exp(-k / 0.6) * Math.cos(k * 2.2);
  const shown = Math.floor(iter * N_IT) + (iter > 0 ? 1 : 0);
  const EP = {x: 1080, y: 760, w: 600, h: 260};
  const epx = (k: number) => EP.x + (k / (N_IT - 1)) * EP.w;
  const epy = (e: number) => EP.y - ((e + 690) / 190) * EP.h;
  const BP = {x: 1080, y: 520, w: 600, sy: 150};
  const bas = [
    {c: 0.32, w: 0.12, a: 0.55, col: C.cyan},
    {c: 0.5, w: 0.2, a: 0.8, col: C.violet},
    {c: 0.7, w: 0.1, a: -0.45, col: C.amber},
  ];
  const orb = (u: number) => bas.reduce((s, b) => s + b.a * g(u, b.c, b.w), 0);
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={mol}>
          {/* rapat elektron (DFT) */}
          <g opacity={dft}>
            {ATOMS.map((a, i) => {
              const q = ap(i);
              return <circle key={i} cx={q.x} cy={q.y} r={a.el === 'C' ? 70 : 80} fill={a.el === 'O' ? 'url(#soft-red)' : a.el === 'N' ? 'url(#soft-violet)' : 'url(#soft-cyan)'} opacity={0.5 + 0.08 * Math.sin(t * 2 + i)} />;
            })}
            <Label x={MC.x} y={MC.y + 300} size={30} color={C.cyan} font="serif" italic>
              ρ(r) — rapat elektron
            </Label>
          </g>
          {BONDS.map(([a, b, o], k) => {
            const A = ap(a);
            const B = ap(b);
            return <Bond key={k} x1={A.x} y1={A.y} x2={B.x} y2={B.y} order={o} width={10} />;
          })}
          {ATOMS.map((a, i) => {
            const q = ap(i);
            return <Atom key={i} x={q.x} y={q.y} el={a.el} r={a.el === 'C' ? 24 : 26} glow={0} />;
          })}
          <Label x={MC.x} y={MC.y - 260} size={26} color={C.muted}>
            kafein: 102 elektron, 24 inti
          </Label>
          <g opacity={pencil}>
            <rect x={1040} y={420} width={660} height={240} rx={22} fill="rgba(12,18,40,0.85)" stroke={C.red} strokeWidth={2} />
            <text x={1370} y={500} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={40} fill={C.ink}>
              Ψ(r₁, r₂, …, r₁₀₂)
            </text>
            <text x={1370} y={560} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.muted}>
              306 koordinat ruang + spin
            </text>
            <text x={1370} y={620} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.red} fontWeight={700}>
              ✗ tidak bisa diselesaikan dengan pensil
            </text>
          </g>
        </g>
        {/* fungsi basis → orbital */}
        <g opacity={basis * (1 - ramp(t, cue(5) - 0.5, cue(5)))}>
          <line x1={BP.x} y1={BP.y} x2={BP.x + BP.w} y2={BP.y} stroke={C.faint} strokeWidth={2} />
          {bas.map((b, i) => (
            <path
              key={i}
              d={Array.from({length: 121}, (_, k) => `${k ? 'L' : 'M'}${(BP.x + (k / 120) * BP.w).toFixed(1)},${(BP.y - b.a * g(k / 120, b.c, b.w) * BP.sy).toFixed(1)}`).join(' ')}
              fill="none"
              stroke={b.col}
              strokeWidth={3}
              strokeDasharray="7 6"
              opacity={1 - 0.5 * sumP}
            />
          ))}
          <path
            d={Array.from({length: 161}, (_, k) => `${k ? 'L' : 'M'}${(BP.x + (k / 160) * BP.w).toFixed(1)},${(BP.y - orb(k / 160) * BP.sy * sumP).toFixed(1)}`).join(' ')}
            fill="none"
            stroke={C.mint}
            strokeWidth={6}
            opacity={sumP}
            filter="url(#glow)"
          />
          <Label x={BP.x + BP.w / 2} y={BP.y - 190} size={26} color={C.ink}>
            {sumP > 0.5 ? 'orbital = Σ c·(fungsi basis)' : 'fungsi basis Gauss'}
          </Label>
        </g>
        {/* iterasi energi */}
        <g opacity={iter > 0 ? 1 - ramp(t, cue(5) - 0.5, cue(5)) : 0}>
          <line x1={EP.x} y1={EP.y} x2={EP.x + EP.w + 20} y2={EP.y} stroke={C.muted} strokeWidth={2} />
          <line x1={EP.x} y1={EP.y} x2={EP.x} y2={EP.y - EP.h - 10} stroke={C.muted} strokeWidth={2} />
          <Label x={EP.x + EP.w} y={EP.y + 30} size={22} color={C.muted} anchor="end">
            iterasi
          </Label>
          <Label x={EP.x - 14} y={EP.y - EP.h} size={22} color={C.muted} anchor="end">
            E
          </Label>
          {Array.from({length: Math.min(N_IT, shown)}, (_, k) => (
            <g key={k}>
              {k > 0 ? <line x1={epx(k - 1)} y1={epy(E(k - 1))} x2={epx(k)} y2={epy(E(k))} stroke={C.gold} strokeWidth={3} /> : null}
              <circle cx={epx(k)} cy={epy(E(k))} r={8} fill={C.gold} />
            </g>
          ))}
          <Label x={EP.x + EP.w - 10} y={epy(E(N_IT - 1)) - 30} size={24} color={C.gold} anchor="end" opacity={shown >= N_IT ? 1 : 0}>
            energi minimum: konvergen
          </Label>
        </g>
        {/* penyaringan kandidat */}
        <g opacity={funnel}>
          <path d="M520,330 L1400,330 L1060,610 L1060,720 L860,720 L860,610 Z" fill="rgba(79,214,255,0.06)" stroke={C.cyan} strokeWidth={3} />
          {Array.from({length: 60}, (_, k) => {
            const x0 = 560 + ((k * 137) % 800);
            const y0 = 290 - ((k * 53) % 60);
            const pass = k % 12 === 0;
            const p = Math.min(1, Math.max(0, flow * 1.6 - (k % 20) * 0.04));
            const x = pass ? x0 + (960 - x0) * p : x0 + (960 - x0) * Math.min(p, 0.55);
            const y = pass ? y0 + (790 - y0) * p : y0 + (520 - y0) * Math.min(p, 0.55) / 0.55;
            return <circle key={k} cx={x} cy={y} r={pass ? 12 : 8} fill={pass ? C.mint : C.muted} opacity={pass ? 1 : 0.8 - 0.5 * p} />;
          })}
          <Label x={960} y={300 - 80} size={26} color={C.muted}>
            ribuan kandidat molekul
          </Label>
          <Label x={1180} y={680} size={26} color={C.mint} anchor="start" weight={700}>
            sedikit yang layak disintesis
          </Label>
          {[
            {x: 300, label: 'obat'},
            {x: 1620, label: 'katalis'},
          ].map((c) => (
            <Label key={c.x} x={c.x} y={480} size={30} color={C.amber} weight={700}>
              {c.label}
            </Label>
          ))}
          <Label x={1620} y={540} size={30} color={C.amber} weight={700}>
            baterai
          </Label>
        </g>
      </Stage>
      <Badge x={960} y={250} text="NOBEL KIMIA 1998 · W. KOHN & J. POPLE" color={C.gold} opacity={win(t, cue(4) - 0.1, cue(5) - 0.1, 0.5, 0.4) * ramp(t, cue(4) - 0.1, cue(4) + 0.6, BACK)} />
      <Badge x={960} y={250} text="DFT: BEKERJA DENGAN RAPAT ELEKTRON ρ(r)" color={C.cyan} opacity={win(t, cue(3) + 0.2, cue(4) - 0.2, 0.5, 0.4)} />
    </AbsoluteFill>
  );
};
