import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Badge, Formula, Frac, Hbar, Label, Op, Stage, Sub, Sup, V} from '../components/primitives';
import {Cx, PhaseWave, Phasor, cadd, cexp, cscale, phaseColor} from '../components/qm';
import {ncol, psi} from '../components/viz';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 10: keadaan stasioner (fase berputar, |ψ|² tetap) vs superposisi dua energi
// (rapat peluang berayun → dipol berosilasi → memancarkan/menyerap cahaya).
const W1 = 1.3; // kecepatan sudut tampilan untuk E₁; E₂ = 4E₁
const B1 = {x: 180, y: 700, w: 620, sy: 120};
const B2 = {x: 260, y: 700, w: 820, sy: 120};

export const Stationary: React.FC = () => {
  const {t, cue} = useScene();
  const part1 = ramp(t, cue(0) + 0.3, cue(0) + 1.3) * (1 - ramp(t, cue(5) - 0.5, cue(5)));
  const ladder = ramp(t, cue(2) - 0.2, cue(2) + 0.8);
  const clock = ramp(t, cue(3) - 0.2, cue(3) + 0.6);
  const dens = ramp(t, cue(4) - 0.2, cue(4) + 0.8);
  const part2 = ramp(t, cue(5) + 0.1, cue(5) + 1.0);
  const slosh = ramp(t, cue(6) - 0.2, cue(6) + 0.8);
  const antenna = ramp(t, cue(7), cue(7) + 1.0);
  const ph1 = -W1 * t;
  const ph2 = -4 * W1 * t;
  const st1 = (u: number): Cx => cscale(cexp(ph1), psi(1, u));
  const sup = (u: number): Cx => cscale(cadd(cscale(cexp(ph1), psi(1, u)), cscale(cexp(ph2), psi(2, u))), Math.SQRT1_2);
  const rhoSup = (u: number) => {
    const z = sup(u);
    return z[0] * z[0] + z[1] * z[1];
  };
  // pusat muatan ⟨x⟩ untuk dipol
  const xMean = (() => {
    let a = 0;
    let b = 0;
    for (let k = 0; k <= 100; k++) {
      const u = k / 100;
      a += u * rhoSup(u);
      b += rhoSup(u);
    }
    return a / b;
  })();
  const dpath = (f: (u: number) => number, B: typeof B1, sy: number) =>
    Array.from({length: 161}, (_, k) => `${k ? 'L' : 'M'}${(B.x + (k / 160) * B.w).toFixed(1)},${(B.y - f(k / 160) * sy).toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill>
      <Stage>
        {/* bagian 1: satu keadaan eigen */}
        <g opacity={part1}>
          {[B1.x, B1.x + B1.w].map((x) => (
            <line key={x} x1={x} y1={B1.y - 330} x2={x} y2={B1.y + 10} stroke={C.ink} strokeWidth={5} />
          ))}
          <line x1={B1.x} y1={B1.y} x2={B1.x + B1.w} y2={B1.y} stroke={C.muted} strokeWidth={2} />
          <g opacity={1 - 0.6 * dens}>
            <PhaseWave f={st1} x={B1.x} y={B1.y} w={B1.w} sy={B1.sy * 1.2} n={160} />
          </g>
          <g opacity={dens}>
            <path d={dpath((u) => psi(1, u) ** 2, B1, B1.sy)} fill="none" stroke={C.ink} strokeWidth={5} filter="url(#glow)" />
            <Label x={B1.x + B1.w / 2} y={B1.y - 2.2 * B1.sy - 30} size={28} color={C.ink} font="serif" italic>
              |ψ|² tetap
            </Label>
          </g>
          <g opacity={clock}>
            <Phasor x={980} y={430} r={70} phi={ph1} />
            <Label x={980} y={540} size={26} color={C.muted}>
              e<tspan baselineShift="super" fontSize={18}>−iEt/ħ</tspan>: panjang tetap, sudut berputar
            </Label>
          </g>
          {/* tangga energi */}
          <g opacity={ladder}>
            {[1, 2, 3, 4].map((n) => {
              const y = 760 - n * n * 28;
              const p = ramp(t, cue(2) + n * 0.25, cue(2) + 0.5 + n * 0.25, BACK);
              return (
                <g key={n} opacity={p}>
                  <line x1={1300} y1={y} x2={1660} y2={y} stroke={ncol(n)} strokeWidth={5} />
                  <Label x={1690} y={y} size={28} color={ncol(n)} font="serif" italic anchor="start">
                    {`E${['₁', '₂', '₃', '₄'][n - 1]}`}
                  </Label>
                </g>
              );
            })}
            <Label x={1480} y={790} size={24} color={C.muted}>
              tingkat energi yang diizinkan
            </Label>
          </g>
        </g>
        {/* bagian 2: superposisi dua energi */}
        <g opacity={part2}>
          {[B2.x, B2.x + B2.w].map((x) => (
            <line key={x} x1={x} y1={B2.y - 330} x2={x} y2={B2.y + 10} stroke={C.ink} strokeWidth={5} />
          ))}
          <line x1={B2.x} y1={B2.y} x2={B2.x + B2.w} y2={B2.y} stroke={C.muted} strokeWidth={2} />
          <g opacity={1 - 0.5 * slosh}>
            <PhaseWave f={sup} x={B2.x} y={B2.y} w={B2.w} sy={B2.sy} n={200} outline={false} />
          </g>
          <path d={dpath(rhoSup, B2, B2.sy * 0.75)} fill="none" stroke={C.ink} strokeWidth={5} opacity={slosh} filter="url(#glow)" />
          {/* dua jam */}
          <Phasor x={1330} y={430} r={60} phi={ph1} color={ncol(1)} />
          <Phasor x={1530} y={430} r={60} phi={ph2} color={ncol(2)} />
          <Label x={1330} y={525} size={26} color={ncol(1)} font="serif" italic>
            E₁
          </Label>
          <Label x={1530} y={525} size={26} color={ncol(2)} font="serif" italic>
            E₂ = 4E₁
          </Label>
          {/* dipol & gelombang terpancar */}
          <g opacity={antenna}>
            <line x1={B2.x + B2.w / 2} y1={B2.y + 60} x2={B2.x + xMean * B2.w} y2={B2.y + 60} stroke={C.gold} strokeWidth={6} markerEnd="url(#arrow-gold)" />
            <Label x={B2.x + B2.w / 2} y={B2.y + 100} size={24} color={C.gold}>
              pusat muatan berayun
            </Label>
            <path
              d={Array.from({length: 121}, (_, j) => {
                const xx = 1130 + j * 5.5;
                const y = 640 - 34 * Math.sin((xx - 1130) / 40 - 3 * W1 * t) * Math.exp(-(xx - 1130) / 900);
                return `${j ? 'L' : 'M'}${xx.toFixed(1)},${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke={phaseColor(1.2)}
              strokeWidth={5}
              filter="url(#glow)"
            />
            <Label x={1500} y={720} size={26} color={C.amber} weight={700}>
              cahaya, ν = (E₂ − E₁)/h
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={960} y={250} p={win(t, cue(0) + 0.3, cue(1) - 0.1, 0.7, 0.4)} accent={C.gold} caption="pemisahan variabel (V tak bergantung waktu)">
        <V>Ψ</V>(<V>x</V>,<V>t</V>)&nbsp;=&nbsp;<V>ψ</V>(<V>x</V>)&thinsp;<V>e</V>
        <Sup>
          −<V>iEt</V>/<Hbar />
        </Sup>
      </Formula>
      <Formula x={960} y={250} p={win(t, cue(1), cue(3) - 0.1, 0.7, 0.4)} accent={C.mint} caption="persamaan Schrödinger tidak bergantung waktu">
        <Op>H</Op>
        <V>ψ</V>
        <Sub>n</Sub>&nbsp;=&nbsp;<V>E</V>
        <Sub>n</Sub>
        <V>ψ</V>
        <Sub>n</Sub>
      </Formula>
      <Badge x={960} y={250} text="STASIONER: |Ψ|² TIDAK BERUBAH" color={C.cyan} opacity={win(t, cue(4), cue(5) - 0.3, 0.5, 0.4)} />
      <Formula x={960} y={250} p={win(t, cue(6), 9999, 0.7, 0.4)} accent={C.amber} caption="frekuensi ayunan = frekuensi cahaya yang diserap/dipancarkan">
        <V>ν</V>&nbsp;=&nbsp;
        <Frac n={<><V>E</V><Sub>2</Sub> − <V>E</V><Sub>1</Sub></>} d={<V>h</V>} />
      </Formula>
    </AbsoluteFill>
  );
};
