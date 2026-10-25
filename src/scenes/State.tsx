import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, rand, ramp, slot, win} from '../anim';
import {Badge, Formula, Label, Stage, Sup, V} from '../components/primitives';
import {Cx, PhaseWave, PhaseWheel, Phasor, sampleRho} from '../components/qm';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 1: ψ kompleks → panah fasor → |ψ|² rapat peluang → titik hasil ukur.
const AX = {x: 200, y: 640, w: 1520, sy: 200};
const amp = (u: number) => Math.exp(-(((u - 0.5) / 0.3) ** 2)) * Math.abs(Math.cos(3 * Math.PI * (u - 0.5)));
const psiAt = (u: number, t: number): Cx => {
  const ph = 26 * u - 2.2 * t;
  return [amp(u) * Math.cos(ph), amp(u) * Math.sin(ph)];
};
const rho = (u: number) => amp(u) ** 2;
const DOTS = sampleRho('state', rho, 900, 1);
const ZEROS = [0.5 - 1 / 6, 0.5 + 1 / 6, 0.5 - 1 / 2 + 0.0001];

export const State: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const waveOn = ramp(t, cue(0) + 0.4, cue(0) + 1.6);
  const arrows = win(t, cue(2) - 0.2, cue(4) + 0.4, 0.8, 0.8);
  const dim = 1 - 0.7 * win(t, cue(3), cue(4), 0.4, 0.4);
  const dens = ramp(t, cue(4) + 0.3, cue(4) + 1.4);
  const strip = win(t, cue(6), cue(7) - 0.1, 0.5, 0.5);
  const big = ramp(t, wordOf(7, 'besar') - 0.3, wordOf(7, 'besar') + 0.4);
  const zero = ramp(t, wordOf(7, 'nol') - 0.3, wordOf(7, 'nol') + 0.4);
  const marks = big * (1 - ramp(t, cue(8) - 0.2, cue(8) + 0.3));
  const dotsN = Math.floor(DOTS.length * ramp(t, cue(8) + 0.3, cue(8) + 5));
  const box = {x: AX.x, y: AX.y, w: AX.w, sy: AX.sy};
  const dpath = Array.from({length: 301}, (_, k) => `${k ? 'L' : 'M'}${(AX.x + (k / 300) * AX.w).toFixed(1)},${(AX.y - rho(k / 300) * AX.sy).toFixed(1)}`).join(' ');
  const xs = 0.5;
  // satu slot kartu di atas: batas antar-kartu (kartu lama hilang dulu, baru kartu berikutnya)
  const S = [cue(0) + 0.2, cue(3) - 0.1, cue(4) - 0.05, cue(6) - 0.05, cue(8) - 0.05];
  return (
    <AbsoluteFill>
      <Stage>
        <line x1={AX.x - 20} y1={AX.y} x2={AX.x + AX.w + 30} y2={AX.y} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" opacity={waveOn} />
        <Label x={AX.x + AX.w + 40} y={AX.y + 30} size={26} color={C.muted} font="serif" italic opacity={waveOn}>
          x
        </Label>
        {/* ψ kompleks: batang berwarna fase setinggi |ψ| */}
        <g opacity={waveOn * dim * (1 - 0.85 * dens)}>
          <PhaseWave f={(u) => psiAt(u, t)} {...box} n={220} />
        </g>
        {/* panah fasor di sepanjang x */}
        <g opacity={arrows}>
          {Array.from({length: 25}, (_, k) => {
            const u = 0.08 + (k / 24) * 0.84;
            const z = psiAt(u, t);
            // panjang panah ≤ 50 px agar panah tetangga (jarak ≈ 53 px) tidak saling tumpang tindih
            const r = Math.hypot(z[0], z[1]) * 50;
            return r > 4 ? <Phasor key={k} x={AX.x + u * AX.w} y={AX.y + 110} r={r} phi={Math.atan2(z[1], z[0])} ring={false} width={4} /> : <circle key={k} cx={AX.x + u * AX.w} cy={AX.y + 110} r={4} fill={C.ink} />;
          })}
          <Label x={AX.x + AX.w} y={AX.y + 190} size={24} color={C.ink} anchor="end">
            panjang = |ψ| · arah = fase
          </Label>
        </g>
        {/* rapat peluang |ψ|² */}
        <g opacity={dens}>
          <path d={`${dpath} L${AX.x + AX.w},${AX.y} L${AX.x},${AX.y} Z`} fill={C.violet} opacity={0.32} />
          <path d={dpath} fill="none" stroke={C.violet} strokeWidth={5} filter="url(#glow)" />
          <Label x={AX.x + AX.w * 0.5} y={AX.y - AX.sy - 36} size={30} color={C.violet} font="serif" italic>
            |ψ|²
          </Label>
        </g>
        <g opacity={strip}>
          <rect x={AX.x + xs * AX.w - 10} y={AX.y - rho(xs) * AX.sy} width={20} height={rho(xs) * AX.sy} fill={C.gold} opacity={0.75} />
          <Label x={AX.x + xs * AX.w + 34} y={AX.y + 34} size={26} color={C.gold} anchor="start" font="serif" italic>
            dx
          </Label>
          <Label x={AX.x + xs * AX.w + 34} y={AX.y - rho(xs) * AX.sy + 40} size={26} color={C.gold} anchor="start">
            luas = peluang
          </Label>
        </g>
        <g opacity={marks}>
          <line x1={AX.x + 0.5 * AX.w + 190} y1={AX.y - AX.sy + 10} x2={AX.x + 0.5 * AX.w + 24} y2={AX.y - AX.sy + 6} stroke={C.mint} strokeWidth={4} markerEnd="url(#arrow-mint)" />
          <Label x={AX.x + 0.5 * AX.w + 204} y={AX.y - AX.sy + 10} size={28} color={C.mint} weight={700} anchor="start">
            sering ditemukan
          </Label>
          <g opacity={zero}>
            {ZEROS.slice(0, 2).map((u) => (
              <g key={u}>
                <circle cx={AX.x + u * AX.w} cy={AX.y} r={14} fill="none" stroke={C.red} strokeWidth={4} />
                <Label x={AX.x + u * AX.w} y={AX.y + 44} size={24} color={C.red} weight={700}>
                  |ψ|² = 0
                </Label>
              </g>
            ))}
          </g>
        </g>
        {/* titik hasil ukur */}
        <g>
          {DOTS.slice(0, dotsN).map((u, k) => (
            <circle key={k} cx={AX.x + u * AX.w} cy={AX.y + 40 + rand(k * 2.13 + 0.4) * 110} r={3.4} fill={C.cyan} opacity={0.8} />
          ))}
        </g>
        <PhaseWheel x={1730} y={250} opacity={waveOn * (1 - dens)} />
      </Stage>
      <Formula x={960} y={250} p={slot(t, S[0], S[1]) * ramp(t, cue(0), cue(0) + 0.7, BACK)} accent={C.gold} caption="postulat 1: seluruh informasi tentang keadaan">
        <V>Ψ</V>(<V>x</V>, <V>t</V>)&nbsp;∈&nbsp;bilangan kompleks
      </Formula>
      <Formula x={960} y={250} p={slot(t, S[2], S[3])} accent={C.violet} caption="rapat peluang (tafsiran Born)">
        <V>ρ</V>&nbsp;=&nbsp;<V>Ψ</V>
        <Sup>*</Sup>
        <V>Ψ</V>&nbsp;=&nbsp;|<V>Ψ</V>|<Sup>2</Sup>
      </Formula>
      <Formula x={960} y={250} p={slot(t, S[3], S[4])} accent={C.gold} caption="peluang menemukan partikel antara x dan x + dx">
        <V>dP</V>&nbsp;=&nbsp;|<V>Ψ</V>(<V>x</V>,<V>t</V>)|<Sup>2</Sup>&thinsp;<V>dx</V>
      </Formula>
      <Badge x={1560} y={250} text="MAX BORN · 1926" color={C.violet} opacity={win(t, cue(5) - 0.2, cue(6) - 0.1, 0.5, 0.4)} />
      <Badge x={960} y={250} text="ψ SENDIRI TIDAK TERUKUR" color={C.red} opacity={slot(t, S[1], S[2], 0.4)} />
      {dotsN > 0 ? <Badge x={960} y={250} text="TITIK-TITIK MENGIKUTI |ψ|²" color={C.cyan} opacity={ramp(t, S[4], S[4] + 0.6)} /> : null}
    </AbsoluteFill>
  );
};
