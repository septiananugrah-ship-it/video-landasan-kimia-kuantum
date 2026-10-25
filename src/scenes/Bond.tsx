import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Badge, Formula, Label, Stage, Sub, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {SpinArrow} from './Pauli';

// Bab 13: H₂. Superposisi dua orbital 1s → orbital ikatan (σ) & antiikatan (σ*),
// diagram orbital molekul, lalu kurva energi potensial (Morse) H₂.
const PX = 260; // piksel per angstrom pada profil
const PROF = {x0: 160, x1: 960, y: 660, cx: 560, sy: 170};
const A0 = 0.529;
const ao = (x: number, c: number) => Math.exp(-Math.abs(x - c) / A0);

// Morse H₂: De = 4,747 eV, a = 1,942 Å⁻¹, re = 0,741 Å; ZPE ≈ 0,27 eV → D₀ ≈ 4,48 eV
const DE = 4.747;
const AM = 1.942;
const RE = 0.741;
const morse = (r: number) => DE * (1 - Math.exp(-AM * (r - RE))) ** 2 - DE;
const MP = {x: 200, y0: 330, w: 760, h: 400, r0: 0.3, r1: 3.2, e0: -5.2, e1: 1.5};
const mx = (r: number) => MP.x + ((r - MP.r0) / (MP.r1 - MP.r0)) * MP.w;
const my = (e: number) => MP.y0 + ((MP.e1 - e) / (MP.e1 - MP.e0)) * MP.h;

export const Bond: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const on = ramp(t, cue(0) + 0.2, cue(0) + 1.2) * (1 - ramp(t, cue(6) - 0.5, cue(6)));
  const approach = ramp(t, cue(1) - 0.2, cue(1) + 2.6, EASE_IN_OUT);
  const R = mix(2.6, RE, approach);
  const xa = -R / 2;
  const xb = R / 2;
  const prof = ramp(t, cue(1) + 1.0, cue(1) + 2.0);
  const sum = win(t, cue(2), cue(4) - 0.1, 0.8, 0.5);
  const diff = ramp(t, cue(4), cue(4) + 0.8);
  const mo = ramp(t, cue(3) + 0.4, cue(3) + 1.4);
  const moStar = ramp(t, cue(4) + 0.6, cue(4) + 1.4);
  const elec = ramp(t, cue(5) + 0.2, cue(5) + 1.0, BACK);
  const curve = ramp(t, cue(6) - 0.1, cue(6) + 1.6, EASE_IN_OUT);
  const minLbl = ramp(t, wordOf(6, 'nol') - 0.2, wordOf(6, 'nol') + 0.6);
  const d0 = ramp(t, cue(7) + 0.3, cue(7) + 1.2);
  const sx = (x: number) => PROF.cx + x * PX;
  const line = (f: (x: number) => number, sy: number) =>
    Array.from({length: 241}, (_, k) => {
      const x = -1.55 + (k / 240) * 3.1;
      return `${k ? 'L' : 'M'}${sx(x).toFixed(1)},${(PROF.y - f(x) * sy).toFixed(1)}`;
    }).join(' ');
  const morsePath = Array.from({length: 241}, (_, k) => {
    const r = 0.45 + (k / 240) * (MP.r1 - 0.45) * curve;
    return `${k ? 'L' : 'M'}${mx(r).toFixed(1)},${Math.min(MP.y0 + MP.h + 40, my(morse(r))).toFixed(1)}`;
  }).join(' ');
  const v0 = -4.478;
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={on}>
          {/* awan & inti */}
          <g opacity={1 - 0.4 * diff}>
            <circle cx={sx(xa)} cy={430} r={110} fill="url(#soft-cyan)" opacity={0.55} />
            <circle cx={sx(xb)} cy={430} r={110} fill="url(#soft-cyan)" opacity={0.55} />
            <ellipse cx={sx(0)} cy={430} rx={60 + 70 * approach} ry={60} fill="url(#soft-mint)" opacity={sum * approach * 0.8} />
          </g>
          {/* σ*: bidang simpul di tengah, rapat elektron nol di antara inti */}
          <g opacity={diff}>
            <line x1={sx(0)} y1={330} x2={sx(0)} y2={530} stroke={C.red} strokeWidth={3} strokeDasharray="8 7" />
            <Label x={sx(0)} y={312} size={24} color={C.red} weight={600}>
              bidang simpul
            </Label>
          </g>
          {[xa, xb].map((x, i) => (
            <g key={i}>
              <circle cx={sx(x)} cy={430} r={16} fill="#f2f5ff" />
              <Label x={sx(x)} y={385} size={24} color={C.ink} weight={700}>
                H
              </Label>
            </g>
          ))}
          {/* profil ψ sepanjang sumbu */}
          <g opacity={prof}>
            <line x1={PROF.x0} y1={PROF.y} x2={PROF.x1} y2={PROF.y} stroke={C.muted} strokeWidth={2} />
            <path d={line((x) => ao(x, xa), PROF.sy)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} strokeDasharray="8 6" />
            <path d={line((x) => ao(x, xb), PROF.sy)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} strokeDasharray="8 6" />
            <g opacity={sum}>
              <path d={line((x) => (ao(x, xa) + ao(x, xb)) * 0.62, PROF.sy)} fill="none" stroke={C.mint} strokeWidth={6} filter="url(#glow)" />
              <Label x={sx(0)} y={PROF.y + 50} size={28} color={C.mint} weight={700}>
                ψ<tspan baselineShift="sub" fontSize={18}>A</tspan> + ψ<tspan baselineShift="sub" fontSize={18}>B</tspan>: menguat di tengah
              </Label>
            </g>
            <g opacity={diff}>
              <path d={line((x) => (ao(x, xa) - ao(x, xb)) * 0.9, PROF.sy)} fill="none" stroke={C.red} strokeWidth={6} />
              <circle cx={sx(0)} cy={PROF.y} r={12} fill="none" stroke={C.red} strokeWidth={4} />
              <Label x={sx(0) - 24} y={PROF.y + 36} size={26} color={C.red} weight={700} anchor="end">
                simpul
              </Label>
            </g>
          </g>
        </g>
        {/* baris 0–2: molekul H₂ sebagai gambaran awal (sebelum diagram orbital molekul) */}
        <g opacity={ramp(t, cue(0) + 0.6, cue(0) + 1.6) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.3))}>
          <ellipse cx={1430} cy={520} rx={210 + 6 * Math.sin(t * 2)} ry={120} fill="url(#soft-cyan)" opacity={0.45} />
          <line x1={1430 - 74} y1={520} x2={1430 + 74} y2={520} stroke="#8b97b8" strokeWidth={14} strokeLinecap="round" />
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <circle cx={1430 + sd * 74} cy={520} r={44} fill="#f2f5ff" stroke="#0b0f1c" strokeWidth={3} />
              <text x={1430 + sd * 74} y={522} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={34} fill="#1d2440">
                H
              </text>
            </g>
          ))}
          <Label x={1430} y={680} size={30} color={C.ink} weight={700}>
            H₂ · 2 proton, 2 elektron
          </Label>
          <Label x={1430} y={722} size={26} color={C.muted}>
            ikatan kimia paling sederhana
          </Label>
        </g>
        {/* diagram orbital molekul */}
        <g opacity={mo}>
          {[
            {x: 1180, label: '1s atom H'},
            {x: 1680, label: '1s atom H'},
          ].map((a) => (
            <g key={a.x}>
              <line x1={a.x - 60} y1={540} x2={a.x + 60} y2={540} stroke={C.cyan} strokeWidth={5} />
              <Label x={a.x} y={585} size={22} color={C.cyan}>
                {a.label}
              </Label>
              <SpinArrow x={a.x} y={510} up len={46} opacity={1 - elec} />
            </g>
          ))}
          <line x1={1370} y1={680} x2={1490} y2={680} stroke={C.mint} strokeWidth={6} />
          <Label x={1430} y={725} size={28} color={C.mint} font="serif" italic>
            σ ikatan
          </Label>
          <line x1={1240} y1={540} x2={1370} y2={680} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
          <line x1={1620} y1={540} x2={1490} y2={680} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
          <g opacity={moStar}>
            <line x1={1370} y1={400} x2={1490} y2={400} stroke={C.red} strokeWidth={6} />
            <Label x={1430} y={360} size={28} color={C.red} font="serif" italic>
              σ* antiikatan
            </Label>
            <line x1={1240} y1={540} x2={1370} y2={400} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
            <line x1={1620} y1={540} x2={1490} y2={400} stroke={C.faint} strokeWidth={2} strokeDasharray="6 6" />
          </g>
          <g opacity={elec}>
            <SpinArrow x={1412} y={652} up len={46} />
            <SpinArrow x={1448} y={652} up={false} len={46} />
          </g>
          <line x1={1100} y1={780} x2={1100} y2={340} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={1080} y={350} size={24} color={C.muted} anchor="end">
            E
          </Label>
        </g>
        {/* kurva energi H₂ */}
        <g opacity={curve}>
          <line x1={MP.x} y1={my(0)} x2={MP.x + MP.w + 20} y2={my(0)} stroke={C.muted} strokeWidth={2} strokeDasharray="6 6" />
          <line x1={MP.x} y1={MP.y0 + MP.h + 40} x2={MP.x + MP.w + 30} y2={MP.y0 + MP.h + 40} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <line x1={MP.x} y1={MP.y0 + MP.h + 40} x2={MP.x} y2={MP.y0 - 20} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={MP.x + MP.w + 30} y={MP.y0 + MP.h + 92} size={24} color={C.muted} anchor="end">
            jarak H–H (Å)
          </Label>
          <Label x={MP.x - 16} y={MP.y0 - 20} size={24} color={C.muted} anchor="end">
            E
          </Label>
          {[0.5, 1, 1.5, 2, 2.5, 3].map((r) => (
            <Label key={r} x={mx(r)} y={MP.y0 + MP.h + 62} size={22} color={C.muted} font="mono">
              {String(r).replace('.', ',')}
            </Label>
          ))}
          <path d={morsePath} fill="none" stroke={C.gold} strokeWidth={6} filter="url(#glow)" />
          <g opacity={minLbl}>
            <line x1={mx(RE)} y1={my(-DE)} x2={mx(RE)} y2={MP.y0 + MP.h + 40} stroke={C.cyan} strokeWidth={2} strokeDasharray="6 6" />
            <Label x={mx(RE) + 14} y={my(-DE) + 40} size={28} color={C.cyan} anchor="start" weight={700}>
              0,74 Å
            </Label>
          </g>
          <g opacity={d0}>
            <line x1={mx(0.55)} y1={my(v0)} x2={mx(1.0)} y2={my(v0)} stroke={C.ink} strokeWidth={3} />
            <Label x={mx(0.5) - 8} y={my(v0)} size={22} color={C.muted} anchor="end">
              v = 0
            </Label>
            <line x1={mx(1.9)} y1={my(v0) - 6} x2={mx(1.9)} y2={my(0) + 8} stroke={C.mint} strokeWidth={5} markerEnd="url(#arrow-mint)" />
            <Label x={mx(1.9) + 20} y={(my(v0) + my(0)) / 2} size={30} color={C.mint} anchor="start" weight={700}>
              ≈ 436 kJ/mol
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={960} y={250} p={win(t, cue(1) + 0.4, cue(4) - 0.1, 0.7, 0.4)} accent={C.mint} caption="kombinasi linear orbital atom (LCAO)">
        <V>ψ</V>
        <Sub>±</Sub>&nbsp;∝&nbsp;<V>ψ</V>
        <Sub>1s,A</Sub>&nbsp;±&nbsp;<V>ψ</V>
        <Sub>1s,B</Sub>
      </Formula>
      <Badge x={960} y={250} text="σ²: DUA ELEKTRON, SPIN BERLAWANAN" color={C.mint} opacity={win(t, cue(5), cue(6) - 0.2, 0.5, 0.4)} />
    </AbsoluteFill>
  );
};
