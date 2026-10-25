import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Badge, Formula, Frac, Label, Op, Stage, Sqrt, Sup, V} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 7: nilai harapan sebagai titik seimbang histogram (1 eV: 1/4, 4 eV: 3/4 → 3,25 eV),
// ketidakpastian ±1,30 eV, lalu ⟨p⟩ = 0 untuk partikel yang bergerak bolak-balik.
const AX = {x0: 300, x1: 1620, y: 700, e0: 0, e1: 5};
const ex = (e: number) => AX.x0 + ((e - AX.e0) / (AX.e1 - AX.e0)) * (AX.x1 - AX.x0);
const MAXH = 330;
const MEAN = 3.25;
const SD = Math.sqrt(0.25 * 1 + 0.75 * 16 - MEAN * MEAN); // 1,299

export const Expect: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const chart = ramp(t, cue(2) - 0.4, cue(2) + 0.6) * (1 - ramp(t, cue(7) - 0.4, cue(7) + 0.3));
  const bar1 = ramp(t, wordOf(2, 'seperempat') - 0.3, wordOf(2, 'seperempat') + 0.6, BACK);
  const bar4 = ramp(t, wordOf(2, 'tiga') - 0.3, wordOf(2, 'tiga') + 0.6, BACK);
  const bal = ramp(t, cue(3) - 0.2, cue(3) + 1.6, EASE_IN_OUT);
  const fx = ex(mix(2.5, MEAN, bal));
  // papan jungkat-jungkit: miring sebelum fulkrum pindah ke titik seimbang
  const tilt = mix(-6, 0, bal);
  const never = win(t, cue(4), cue(5) - 0.1, 0.5, 0.4);
  const drop = Math.floor(Math.max(0, t - cue(4) - 0.3) / 0.7);
  const dropE = drop % 3 === 1 ? 1 : 4;
  const dropP = ((Math.max(0, t - cue(4) - 0.3) % 0.7) / 0.7);
  const sd = ramp(t, cue(6) - 0.2, cue(6) + 1.0, EASE_IN_OUT);
  const box = ramp(t, cue(7) + 0.2, cue(7) + 1.0);
  const bx = 0.5 + 0.42 * Math.sin((t - cue(7)) * 2.2);
  const dir = Math.cos((t - cue(7)) * 2.2) > 0 ? 1 : -1;
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={chart}>
          <line x1={AX.x0 - 30} y1={AX.y} x2={AX.x1 + 40} y2={AX.y} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          {[0, 1, 2, 3, 4, 5].map((e) => (
            <g key={e}>
              <line x1={ex(e)} y1={AX.y} x2={ex(e)} y2={AX.y + 12} stroke={C.muted} strokeWidth={2} />
              <Label x={ex(e)} y={AX.y + 36} size={24} color={C.muted} font="mono">
                {`${e}`}
              </Label>
            </g>
          ))}
          <Label x={AX.x1 + 40} y={AX.y + 36} size={24} color={C.muted}>
            E (eV)
          </Label>
          {/* plank (garis seimbang) */}
          <g transform={`rotate(${tilt} ${fx} ${AX.y})`}>
            <rect x={ex(0.6)} y={AX.y - 6} width={ex(4.4) - ex(0.6)} height={6} fill={C.ink} opacity={0.5} />
            {[
              {e: 1, p: 0.25, k: bar1, col: C.cyan, lbl: '1/4'},
              {e: 4, p: 0.75, k: bar4, col: C.violet, lbl: '3/4'},
            ].map((b) => (
              <g key={b.e}>
                <rect x={ex(b.e) - 60} y={AX.y - 6 - b.p * MAXH * b.k} width={120} height={b.p * MAXH * b.k} rx={8} fill={b.col} opacity={0.85} />
                <Label x={ex(b.e)} y={AX.y - 34 - b.p * MAXH * b.k} size={30} color={b.col} weight={700} font="mono" opacity={b.k}>
                  {b.lbl}
                </Label>
              </g>
            ))}
          </g>
          {/* fulkrum */}
          <g opacity={ramp(t, cue(3) - 0.4, cue(3) + 0.3)}>
            <path d={`M${fx},${AX.y + 4} L${fx - 34},${AX.y + 60} L${fx + 34},${AX.y + 60} Z`} fill={C.gold} />
            <Label x={fx} y={AX.y + 92} size={30} color={C.gold} weight={700} font="mono">
              {bal > 0.98 ? '⟨E⟩ = 3,25' : ''}
            </Label>
          </g>
          {/* satu kali ukur: hanya 1 atau 4 */}
          <g opacity={never}>
            <circle cx={ex(dropE)} cy={mix(330, AX.y - 20, dropP)} r={14} fill={C.gold} filter="url(#glow)" opacity={1 - dropP * 0.3} />
            <line x1={ex(MEAN) - 30} y1={420} x2={ex(MEAN) + 30} y2={480} stroke={C.red} strokeWidth={7} />
            <line x1={ex(MEAN) + 30} y1={420} x2={ex(MEAN) - 30} y2={480} stroke={C.red} strokeWidth={7} />
            <Label x={ex(MEAN)} y={390} size={26} color={C.red} weight={700}>
              tak pernah 3,25
            </Label>
          </g>
          {/* ketidakpastian */}
          <g opacity={sd}>
            <rect x={ex(MEAN - SD)} y={AX.y - 330} width={ex(MEAN + SD) - ex(MEAN - SD)} height={330} fill={C.gold} opacity={0.08} />
            <line x1={ex(MEAN - SD)} y1={AX.y - 330} x2={ex(MEAN - SD)} y2={AX.y} stroke={C.gold} strokeWidth={2} strokeDasharray="8 8" />
            <line x1={ex(MEAN + SD)} y1={AX.y - 330} x2={ex(MEAN + SD)} y2={AX.y} stroke={C.gold} strokeWidth={2} strokeDasharray="8 8" />
            <line x1={ex(MEAN - SD) + 8} y1={AX.y - 305} x2={ex(MEAN + SD) - 8} y2={AX.y - 305} stroke={C.gold} strokeWidth={3} markerEnd="url(#arrow-gold)" markerStart="url(#arrow-gold)" />
            <Label x={ex(MEAN)} y={AX.y - 352} size={28} color={C.gold} weight={700}>
              ΔE ≈ 1,30 eV
            </Label>
          </g>
        </g>
        {/* ⟨p⟩ = 0 tetapi bergerak */}
        <g opacity={box}>
          {[360, 1060].map((x) => (
            <line key={x} x1={x} y1={420} x2={x} y2={640} stroke={C.ink} strokeWidth={5} />
          ))}
          <line x1={360} y1={640} x2={1060} y2={640} stroke={C.muted} strokeWidth={2} />
          <circle cx={360 + 30 + bx * 640} cy={600} r={26} fill={C.amber} filter="url(#glow)" />
          <line x1={360 + 30 + bx * 640} y1={545} x2={360 + 30 + bx * 640 + dir * 90} y2={545} stroke={C.amber} strokeWidth={5} markerEnd="url(#arrow-gold)" />
          {/* histogram momentum */}
          <line x1={1180} y1={640} x2={1720} y2={640} stroke={C.muted} strokeWidth={2} />
          {[-1, 1].map((s) => (
            <rect key={s} x={1450 + s * 170 - 40} y={640 - 200} width={80} height={200} rx={8} fill={C.violet} opacity={0.85} />
          ))}
          <Label x={1280} y={680} size={26} color={C.violet} font="serif" italic>
            −ħk
          </Label>
          <Label x={1620} y={680} size={26} color={C.violet} font="serif" italic>
            +ħk
          </Label>
          <line x1={1450} y1={400} x2={1450} y2={650} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" />
          <Label x={1450} y={375} size={28} color={C.gold} weight={700}>
            ⟨p⟩ = 0
          </Label>
          <Label x={710} y={700} size={26} color={C.muted}>
            ke kanan & ke kiri, peluang sama
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={250} p={win(t, cue(0) + 0.3, cue(2) - 0.1, 0.7, 0.4)} accent={C.gold} caption="postulat 4: nilai harapan (ψ ternormalisasi)">
        ⟨<V>A</V>⟩&nbsp;=&nbsp;<span style={{fontSize: '1.2em'}}>∫</span>&thinsp;<V>Ψ</V>
        <Sup>*</Sup>&thinsp;<Op>A</Op>&thinsp;<V>Ψ</V>&thinsp;<V>dτ</V>
      </Formula>
      <Formula x={960} y={250} p={win(t, cue(3), cue(5) - 0.1, 0.7, 0.4)} accent={C.gold} caption="rata-rata berbobot peluang">
        ⟨<V>E</V>⟩&nbsp;=&nbsp;
        <Frac n="1" d="4" />
        (1)&nbsp;+&nbsp;
        <Frac n="3" d="4" />
        (4)&nbsp;=&nbsp;3,25 eV
      </Formula>
      <Formula x={960} y={250} p={win(t, cue(5), cue(6) - 0.1, 0.7, 0.4)} accent={C.gold} caption="ketidakpastian (simpangan baku)">
        Δ<V>A</V>&nbsp;=&nbsp;
        <Sqrt>
          ⟨<V>A</V>
          <Sup>2</Sup>⟩&nbsp;−&nbsp;⟨<V>A</V>⟩<Sup>2</Sup>
        </Sqrt>
      </Formula>
      <Formula x={960} y={250} p={win(t, cue(6), cue(7) - 0.1, 0.7, 0.4)} accent={C.gold} caption="⟨E²⟩ = ¼·1 + ¾·16 = 12,25 eV²">
        Δ<V>E</V>&nbsp;=&nbsp;
        <Sqrt>12,25 − 3,25<Sup>2</Sup></Sqrt>
        &nbsp;≈&nbsp;1,30 eV
      </Formula>
      <Badge x={960} y={250} text="⟨p⟩ = 0  ≠  DIAM" color={C.amber} opacity={ramp(t, cue(7) + 0.4, cue(7) + 1.0, BACK)} />
    </AbsoluteFill>
  );
};
