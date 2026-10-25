import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, win} from '../anim';
import {Badge, Formula, Frac, Hbar, Label, Op, Stage, V} from '../components/primitives';
import {PhaseWave, PhaseWheel, cabs, freePacket} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 9: persamaan Schrödinger bergantung waktu. Paket Gauss bebas (solusi analitik)
// merambat sambil melebar; pada pengukuran ia "runtuh" menjadi satu titik.
const AX = {x: 120, y: 640, w: 1680, sy: 210};
const X0 = -12;
const X1 = 28;
const SIG = 1.4;
const K0 = 2.5;
const xs = (u: number) => X0 + u * (X1 - X0);
const pk = (tau: number) => (u: number) => freePacket(xs(u), tau, -8, SIG, K0);

export const TDSE: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const on = ramp(t, cue(0) + 0.3, cue(0) + 1.4);
  const meas = wordOf(4, 'pengukuran');
  // waktu simulasi: 0 → 4 selama baris 2–4, lalu diulang 0 → 10 di baris 5–6
  const run1 = ramp(t, cue(2), meas, (x) => x) * 4;
  const run2 = ramp(t, cue(5) - 0.2, cue(6) + 4, (x) => x) * 10;
  const phase2 = t >= cue(5) - 0.2;
  const tau = phase2 ? run2 : run1;
  const collapse = !phase2 && t > meas ? ramp(t, meas, meas + 0.4) : 0;
  // posisi hasil ukur: diambil dari |ψ|² saat τ = 4
  const hit = (() => {
    const f = pk(4);
    let best = 0.5;
    let acc = 0;
    const r = rand(42.7);
    const tot = Array.from({length: 400}, (_, k) => cabs(f(k / 400)) ** 2).reduce((a, b) => a + b, 0);
    for (let k = 0; k < 400; k++) {
      acc += cabs(f(k / 400)) ** 2 / tot;
      if (acc >= r) {
        best = k / 400;
        break;
      }
    }
    return best;
  })();
  const ghosts = phase2 ? [] : [0, 1, 2, 3].filter((g) => g < run1 - 0.2);
  const clock = phase2 ? tau : run1;
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={on}>
          <line x1={AX.x} y1={AX.y} x2={AX.x + AX.w} y2={AX.y} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={AX.x + AX.w + 20} y={AX.y + 30} size={26} color={C.muted} font="serif" italic>
            x
          </Label>
          {/* jejak waktu sebelumnya (fase 1) */}
          {ghosts.map((g) => (
            <g key={g} opacity={0.18 * (1 - collapse)}>
              <PhaseWave f={pk(g)} x={AX.x} y={AX.y} w={AX.w} sy={AX.sy} n={200} outline={false} />
            </g>
          ))}
          <g opacity={1 - collapse}>
            <PhaseWave f={pk(tau)} x={AX.x} y={AX.y} w={AX.w} sy={AX.sy} n={260} />
          </g>
          {/* runtuh menjadi satu titik saat diukur */}
          {collapse > 0 ? (
            <g>
              <circle cx={AX.x + hit * AX.w} cy={AX.y - 20} r={60 * (1 - collapse) + 14} fill="url(#soft-white)" opacity={1 - collapse * 0.4} />
              <circle cx={AX.x + hit * AX.w} cy={AX.y - 20} r={13} fill={C.gold} filter="url(#glow)" opacity={collapse} />
              <Label x={AX.x + hit * AX.w} y={AX.y - 80} size={28} color={C.gold} weight={700} opacity={collapse}>
                terukur di sini
              </Label>
            </g>
          ) : null}
          {/* jam */}
          <g transform="translate(1680 420)">
            <circle r={52} fill="rgba(12,18,40,0.85)" stroke={C.faint} strokeWidth={3} />
            <line x1={0} y1={0} x2={40 * Math.sin(clock * 0.9)} y2={-40 * Math.cos(clock * 0.9)} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
            <text x={0} y={86} textAnchor="middle" fontFamily={FONT.mono} fontSize={24} fill={C.muted}>
              {`t = ${clock.toFixed(1).replace('.', ',')}`}
            </text>
          </g>
        </g>
        <PhaseWheel x={230} y={360} opacity={ramp(t, cue(6), cue(6) + 0.8)} />
        <g opacity={win(t, wordOf(5, 'melebar') - 0.2, cue(6) + 0.2, 0.5, 0.6)}>
          <Label x={960} y={AX.y + 70} size={28} color={C.ink}>
            komponen momentum besar berlari lebih cepat → paket melebar
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={250} p={win(t, cue(1), cue(4) - 0.1, 0.7, 0.4)} accent={C.gold} caption="postulat 5: persamaan Schrödinger bergantung waktu">
        <V>i</V>
        <Hbar />
        &thinsp;
        <Frac n={<>∂<V>Ψ</V></>} d={<>∂<V>t</V></>} />
        &nbsp;=&nbsp;<Op>H</Op>&thinsp;<V>Ψ</V>
      </Formula>
      <Badge x={960} y={250} text="KEACAKAN HANYA SAAT PENGUKURAN" color={C.red} opacity={win(t, cue(4), cue(5) - 0.3, 0.5, 0.4) * ramp(t, cue(4), cue(4) + 0.6, BACK)} />
      <Badge x={960} y={250} text="DETERMINISTIK: Ψ(0) → Ψ(t)" color={C.mint} opacity={win(t, cue(5) - 0.2, 9999, 0.5, 0.4)} />
    </AbsoluteFill>
  );
};
