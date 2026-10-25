import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, slot} from '../anim';
import {Formula, Frac, Hbar, Label, Op, Stage, Sub, Sup, V} from '../components/primitives';
import {FnPanel, Machine} from '../components/machine';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 4: operator sebagai mesin fungsi → fungsi. Masukan sin(2πx); keluaran tergantung operator.
const MY = 580;
const IN = {x: 150, w: 440};
const OUT = {x: 1330, w: 440};
const fin = (u: number) => Math.sin(2 * Math.PI * u);

type Stage4 = {label: React.ReactNode; out: (u: number) => number; tag: string; col: string};

export const Operator: React.FC = () => {
  const {t, cue} = useScene();
  const on = ramp(t, cue(0) + 0.3, cue(0) + 1.2) * (1 - ramp(t, cue(7) - 0.45, cue(7) - 0.05));
  // linear: masukan dikali 2 → keluaran juga tepat dikali 2
  const lin = ramp(t, cue(6) + 0.5, cue(6) + 1.8, EASE_IN_OUT);
  const amp = 1 + 0.6 * lin;
  const stages: (Stage4 & {a: number; b: number})[] = [
    {label: <Op>A</Op>, out: (u) => Math.sin(2 * Math.PI * u + 0.8) * (0.6 + 0.4 * u), tag: 'fungsi baru', col: C.mint, a: cue(1), b: cue(2)},
    {label: <Op>x</Op>, out: (u) => 1.6 * u * fin(u), tag: 'x · sin(2πx)', col: C.cyan, a: cue(2), b: cue(3)},
    {label: <Op>p</Op>, out: (u) => Math.cos(2 * Math.PI * u), tag: '∝ cos(2πx)', col: C.violet, a: cue(3), b: cue(4)},
    // T̂ sin(2πx) = +(ħ²(2π)²/2m) sin(2πx): bentuk sama, faktor positif (energi kinetik > 0)
    {label: <Op>T</Op>, out: (u) => 1.3 * fin(u), tag: '∝ +sin(2πx)', col: C.gold, a: cue(4), b: cue(5)},
    {label: <Op>H</Op>, out: (u) => fin(u) * (0.75 + 3.2 * (u - 0.5) ** 2), tag: 'T̂ψ + V(x)ψ', col: C.amber, a: cue(5), b: cue(7)},
  ];
  const cur = stages.filter((s) => t >= s.a - 0.2).pop();
  const k = cur ? ramp(t, cur.a + 0.3, cur.a + 1.6, EASE_IN_OUT) : 0;
  const herm = ramp(t, cue(7) - 0.05, cue(7) + 0.8);
  const real = ramp(t, cue(7) + 0.2, cue(7) + 1.4, BACK);
  // bidang kompleks: nilai eigen Hermitian di sumbu real
  const PC = {x: 960, y: 610};
  const EIG = [-2.2, -0.8, 0.5, 1.6, 2.6];
  // satu slot kartu di atas: kartu lama hilang dulu sebelum kartu berikutnya muncul
  const S = [cue(0) + 0.3, cue(2) - 0.05, cue(3) - 0.05, cue(4) - 0.05, cue(5) - 0.05, cue(6) - 0.05, cue(7) - 0.05];
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={on}>
          <FnPanel x={IN.x} y={MY} w={IN.w} f={fin} sy={90 * amp} color={C.ink} label={lin > 0.5 ? 'masukan × 1,6' : 'masukan: sin(2πx)'} />
          {/* paket fungsi yang meluncur masuk */}
          {cur ? (
            <g opacity={1 - k}>
              <FnPanel x={IN.x + (960 - 150 - IN.x - IN.w / 2) * k * 1.2} y={MY} w={IN.w * (1 - 0.6 * k)} f={fin} sy={90 * (1 - 0.5 * k)} color={C.ink} />
            </g>
          ) : null}
          <Machine x={960} y={MY} label={cur ? cur.label : <Op>A</Op>} t={t} active={cur ? Math.sin(Math.PI * k) : 0} color={cur ? cur.col : C.gold} />
          {cur ? <FnPanel x={OUT.x} y={MY} w={OUT.w} f={cur.out} sy={90 * amp} color={cur.col} label={lin > 0.5 ? 'keluaran juga × 1,6' : `keluaran: ${cur.tag}`} draw={ramp(t, cur.a + 1.2, cur.a + 2.2)} /> : null}
          <line x1={IN.x + IN.w + 30} y1={MY} x2={960 - 200} y2={MY} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" opacity={0.6} />
          <line x1={960 + 200} y1={MY} x2={OUT.x - 30} y2={MY} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" opacity={0.6} />
        </g>
        <g opacity={herm}>
          <line x1={PC.x - 520} y1={PC.y} x2={PC.x + 540} y2={PC.y} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <line x1={PC.x} y1={PC.y + 40} x2={PC.x} y2={PC.y - 210} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={PC.x + 560} y={PC.y + 34} size={26} color={C.muted}>
            Re
          </Label>
          <Label x={PC.x + 36} y={PC.y - 205} size={26} color={C.muted}>
            Im
          </Label>
          {EIG.map((e, i) => {
            const p = ramp(t, cue(7) + 0.3 + i * 0.2, cue(7) + 0.8 + i * 0.2, BACK);
            return <circle key={i} cx={PC.x + e * 190} cy={PC.y} r={14 * p} fill={C.mint} filter="url(#glow)" />;
          })}
          <g opacity={real}>
            <circle cx={PC.x + 260} cy={PC.y - 150} r={14} fill="none" stroke={C.red} strokeWidth={4} />
            <line x1={PC.x + 236} y1={PC.y - 174} x2={PC.x + 284} y2={PC.y - 126} stroke={C.red} strokeWidth={5} />
            <Label x={PC.x + 300} y={PC.y - 150} size={26} color={C.red} anchor="start">
              hasil kompleks: tidak mungkin
            </Label>
            <Label x={PC.x} y={PC.y + 70} size={28} color={C.mint} weight={700}>
              hasil ukur selalu real
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={960} y={260} p={slot(t, S[0], S[1])} accent={C.mint} caption="postulat 2: besaran fisis ↔ operator">
        <Op>A</Op>&thinsp;<V>f</V>(<V>x</V>)&nbsp;=&nbsp;<V>g</V>(<V>x</V>)
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[1], S[2])} accent={C.cyan} caption="operator posisi: kalikan dengan x">
        <Op>x</Op>&thinsp;<V>ψ</V>&nbsp;=&nbsp;<V>x</V>&thinsp;<V>ψ</V>
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[2], S[3])} accent={C.violet} caption="operator momentum">
        <Op>p</Op>
        <Sub>x</Sub>&nbsp;=&nbsp;−<V>i</V>
        <Hbar />
        &thinsp;
        <Frac n={<V>d</V>} d={<V>dx</V>} />
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[3], S[4])} accent={C.gold} caption="energi kinetik = p² / 2m">
        <Op>T</Op>&nbsp;=&nbsp;−
        <Frac
          n={
            <>
              <Hbar />
              <Sup>2</Sup>
            </>
          }
          d={<>2<V>m</V></>}
        />
        <Frac
          n={
            <>
              <V>d</V>
              <Sup>2</Sup>
            </>
          }
          d={
            <>
              <V>dx</V>
              <Sup>2</Sup>
            </>
          }
        />
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[4], S[5])} accent={C.gold} caption="Hamiltonian: operator energi total">
        <Op>H</Op>&nbsp;=&nbsp;<Op>T</Op>&nbsp;+&nbsp;<Op>V</Op>
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[5], S[6])} accent={C.mint} caption="linear: kombinasi masuk → kombinasi yang sama keluar">
        <Op>A</Op>(<V>c</V>
        <Sub>1</Sub>
        <V>f</V>&nbsp;+&nbsp;<V>c</V>
        <Sub>2</Sub>
        <V>g</V>)&nbsp;=&nbsp;<V>c</V>
        <Sub>1</Sub>
        <Op>A</Op>
        <V>f</V>&nbsp;+&nbsp;<V>c</V>
        <Sub>2</Sub>
        <Op>A</Op>
        <V>g</V>
      </Formula>
      <Formula x={960} y={260} p={slot(t, S[6], 9999)} accent={C.mint} caption="operator Hermitian → nilai eigen real">
        <Op>A</Op>
        <Sup>†</Sup>&nbsp;=&nbsp;<Op>A</Op>&nbsp;⇒&nbsp;<V>a</V>
        <Sub>n</Sub>&nbsp;∈&nbsp;ℝ
      </Formula>
    </AbsoluteFill>
  );
};
