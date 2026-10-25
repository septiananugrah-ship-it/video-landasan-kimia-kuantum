import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Badge, Card, Formula, Frac, Hbar, Label, Op, Stage, Sub, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 8: komutator [x̂, p̂] = iħ, ketidakpastian Heisenberg (Gauss sempit ↔ lebar),
// dan operator yang komut (L², L_z: vektor L berpresesi pada kerucut).
const gauss = (u: number, s: number) => Math.exp(-((u / s) ** 2) / 2);

const Block: React.FC<{x: number; y: number; label: React.ReactNode; col: string}> = ({x, y, label, col}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 70,
      top: y - 70,
      width: 140,
      height: 140,
      borderRadius: 24,
      border: `3px solid ${col}`,
      background: 'rgba(14,20,44,0.92)',
      boxShadow: `0 0 30px ${col}44`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 70,
      color: C.ink,
    }}
  >
    {label}
  </div>
);

export const Commute: React.FC = () => {
  const {t, cue} = useScene();
  const blocks = ramp(t, cue(0) + 0.3, cue(0) + 1.0) * (1 - ramp(t, cue(2) - 0.4, cue(2)));
  const swap = ramp(t, cue(0) + 2.4, cue(0) + 3.6, EASE_IN_OUT);
  const der = ramp(t, cue(2) - 0.2, cue(2) + 0.6) * (1 - ramp(t, cue(5) - 0.4, cue(5)));
  const l1 = ramp(t, cue(2) + 0.6, cue(2) + 1.3);
  const l2 = ramp(t, cue(2) + 2.4, cue(2) + 3.1);
  const strike = ramp(t, cue(3) + 0.3, cue(3) + 1.2);
  const l3 = ramp(t, cue(3) + 1.6, cue(3) + 2.4, BACK);
  const plots = ramp(t, cue(5) + 0.4, cue(5) + 1.4) * (1 - ramp(t, cue(7) - 0.4, cue(7)));
  // lebar paket berayun: sempit ↔ lebar (hasil kali tetap ħ/2 untuk Gauss)
  const breathe = 0.5 + 0.5 * Math.sin(Math.max(0, t - cue(6)) * 1.4 - Math.PI / 2);
  const sx = mix(0.32, 0.12, ramp(t, cue(6), cue(6) + 1.2) * breathe);
  const sp = 0.05 / sx;
  const cone = ramp(t, cue(7) + 0.2, cue(7) + 1.2);
  const ang = (t - cue(7)) * 1.8;
  const box1 = {x: 220, y: 720, w: 620, sy: 300};
  const box2 = {x: 1080, y: 720, w: 620, sy: 300};
  const plot = (b: typeof box1, s: number, col: string) => {
    const pts = Array.from({length: 201}, (_, k) => {
      const u = k / 200 - 0.5;
      return `${(b.x + (k / 200) * b.w).toFixed(1)},${(b.y - gauss(u, s) * b.sy).toFixed(1)}`;
    });
    return (
      <g>
        <path d={`M${b.x},${b.y} L${pts.join(' L')} L${b.x + b.w},${b.y} Z`} fill={col} opacity={0.3} />
        <path d={`M${pts.join(' L')}`} fill="none" stroke={col} strokeWidth={5} />
        <line x1={b.x} y1={b.y} x2={b.x + b.w} y2={b.y} stroke={C.muted} strokeWidth={2} />
        <line x1={b.x + b.w / 2 - s * b.w} y1={b.y + 26} x2={b.x + b.w / 2 + s * b.w} y2={b.y + 26} stroke={col} strokeWidth={3} markerStart={`url(#arrow-${col === C.cyan ? 'cyan' : 'violet'})`} markerEnd={`url(#arrow-${col === C.cyan ? 'cyan' : 'violet'})`} />
      </g>
    );
  };
  // kerucut L: |L| = √(l(l+1)) ħ, L_z = m ħ (l = 1, m = 1)
  const CX = 960;
  const CY = 640;
  const Lz = 150;
  const Lr = 150;
  const tipX = CX + Lr * Math.cos(ang);
  const tipY = CY - Lz - 0.32 * Lr * Math.sin(ang);
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={plots}>
          {plot(box1, sx, C.cyan)}
          {plot(box2, sp, C.violet)}
          <Label x={box1.x + box1.w / 2} y={box1.y + 64} size={28} color={C.cyan} weight={600}>
            {`posisi: Δx`}
          </Label>
          <Label x={box2.x + box2.w / 2} y={box2.y + 64} size={28} color={C.violet} weight={600}>
            {`momentum: Δp`}
          </Label>
          <rect x={960 - 170} y={410} width={340} height={64} rx={14} fill="rgba(12,18,40,0.9)" stroke={C.gold} strokeWidth={2} />
          <text x={960} y={442} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={28} fontWeight={600} fill={C.gold}>
            Δx · Δp = ħ/2
          </text>
          <Label x={960} y={500} size={22} color={C.muted}>
            (paket Gauss: nilai minimum)
          </Label>
        </g>
        <g opacity={cone}>
          <line x1={CX} y1={CY + 120} x2={CX} y2={CY - 290} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={CX + 26} y={CY - 290} size={28} color={C.muted} font="serif" italic anchor="start">
            z
          </Label>
          <ellipse cx={CX} cy={CY - Lz} rx={Lr} ry={0.32 * Lr} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray="7 7" opacity={0.7} />
          <path d={`M${CX - Lr},${CY - Lz} L${CX},${CY} L${CX + Lr},${CY - Lz}`} fill={C.violet} opacity={0.08} />
          <line x1={CX} y1={CY} x2={tipX} y2={tipY} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
          <circle cx={tipX} cy={tipY} r={10} fill={C.gold} filter="url(#glow)" />
          <line x1={CX} y1={CY} x2={CX} y2={CY - Lz} stroke={C.mint} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
          <Label x={CX - 30} y={CY - Lz / 2} size={28} color={C.mint} anchor="end" weight={700}>
            L<tspan baselineShift="sub" fontSize={20}>z</tspan> pasti
          </Label>
          <Label x={CX + Lr + 30} y={CY - Lz} size={28} color={C.gold} anchor="start" weight={700}>
            |L| pasti
          </Label>
          <Label x={CX} y={CY + 160} size={26} color={C.muted}>
            L<tspan baselineShift="sub" fontSize={18}>x</tspan> dan L<tspan baselineShift="sub" fontSize={18}>y</tspan> tidak pasti: vektor bisa di mana saja pada kerucut
          </Label>
        </g>
      </Stage>
      {/* urutan operator: AB vs BA */}
      <div style={{position: 'absolute', inset: 0, opacity: blocks}}>
        <Block x={mix(760, 960, swap)} y={560} label={<Op>A</Op>} col={C.cyan} />
        <Block x={mix(960, 760, swap)} y={560 + Math.sin(swap * Math.PI) * -110} label={<Op>B</Op>} col={C.violet} />
        <div style={{position: 'absolute', left: 1080, top: 530, fontFamily: FONT.serif, fontSize: 56, color: C.ink, opacity: 0.9}}>
          <V>ψ</V>
        </div>
        <div style={{position: 'absolute', left: 1180, top: 535, fontFamily: FONT.sans, fontSize: 34, color: swap > 0.5 ? C.red : C.mint}}>{swap > 0.5 ? 'BAψ ≠ ABψ ?' : 'ABψ'}</div>
      </div>
      {/* penurunan [x̂, p̂] */}
      <Card x={960} y={520} opacity={der} accent={C.gold} style={{padding: '30px 50px'}}>
        <div style={{fontFamily: FONT.serif, fontSize: 52, lineHeight: 1.6, whiteSpace: 'nowrap'}}>
          <div style={{opacity: l1}}>
            <Op>x</Op>
            <Op>p</Op>
            <V>ψ</V>&nbsp;=&nbsp;−<V>i</V>
            <Hbar />
            &thinsp;
            <span style={{position: 'relative'}}>
              <V>x</V>
              <V>ψ</V>′
              <span style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 4, background: C.red, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
            </span>
          </div>
          <div style={{opacity: l2}}>
            <Op>p</Op>
            <Op>x</Op>
            <V>ψ</V>&nbsp;=&nbsp;−<V>i</V>
            <Hbar />
            &thinsp;(<V>ψ</V>&nbsp;+&nbsp;
            <span style={{position: 'relative'}}>
              <V>x</V>
              <V>ψ</V>′
              <span style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 4, background: C.red, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
            </span>
            )
          </div>
          <div style={{opacity: l3, color: C.gold, borderTop: `2px solid ${C.faint}`, marginTop: 8, paddingTop: 6}}>
            [<Op>x</Op>, <Op>p</Op>]&thinsp;<V>ψ</V>&nbsp;=&nbsp;<V>i</V>
            <Hbar />
            &thinsp;<V>ψ</V>
          </div>
        </div>
      </Card>
      <Formula x={960} y={250} p={win(t, cue(1), cue(2) - 0.1, 0.7, 0.4)} accent={C.cyan} caption="komutator: urutan operator penting">
        [<Op>A</Op>, <Op>B</Op>]&nbsp;=&nbsp;<Op>A</Op>
        <Op>B</Op>&nbsp;−&nbsp;<Op>B</Op>
        <Op>A</Op>
      </Formula>
      <Badge x={960} y={250} text="KOMUTATOR ≠ 0 → TIDAK BISA SAMA-SAMA PASTI" color={C.red} opacity={win(t, cue(4), cue(5) - 0.1, 0.5, 0.4)} />
      <Formula x={960} y={250} p={win(t, cue(5), cue(7) - 0.1, 0.7, 0.4)} accent={C.gold} caption="prinsip ketidakpastian Heisenberg">
        Δ<V>x</V>&thinsp;Δ<V>p</V>
        <Sub>x</Sub>&nbsp;≥&nbsp;
        <Frac n={<Hbar />} d="2" />
      </Formula>
      <Formula x={960} y={250} p={ramp(t, cue(7) + 0.3, cue(7) + 1.0)} accent={C.mint} caption="operator yang komut: nilai pasti bersamaan">
        [<Op>L</Op>
        <Sup>2</Sup>, <Op>L</Op>
        <Sub>z</Sub>]&nbsp;=&nbsp;0
      </Formula>
    </AbsoluteFill>
  );
};
