import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, slot, win} from '../anim';
import {Badge, Formula, Frac, Label, Stage, Sub, V} from '../components/primitives';
import {Electron} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 15: spin proton dalam medan magnet → dua tingkat (Zeeman) → frekuensi radio ν = (γ/2π)B.
// NMR (spektrum etanol skematis) dan MRI (cincin magnet + irisan kepala skematis).
const GAMMA = 42.577; // MHz/T untuk ¹H
const PL = {x: 1000, y: 780, w: 700, h: 350, b1: 10, n1: 450};
const px = (b: number) => PL.x + (b / PL.b1) * PL.w;
const py = (nu: number) => PL.y - (nu / PL.n1) * PL.h;

const peak = (d: number, center: number, n: number, J = 0.07, w = 0.012) => {
  // multiplet ber-intensitas binomial
  const coef = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]][n - 1];
  return coef.reduce((s, c, k) => s + c * Math.exp(-(((d - (center + (k - (n - 1) / 2) * J)) / w) ** 2)), 0);
};

export const MRI: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const proton = ramp(t, cue(0) + 0.2, cue(0) + 1.0) * (1 - ramp(t, cue(4) - 0.5, cue(4)));
  const field = ramp(t, cue(1) - 0.2, cue(1) + 0.8);
  const plot = ramp(t, cue(2) - 0.2, cue(2) + 0.8) * (1 - ramp(t, cue(4) - 0.5, cue(4)));
  const nmrPt = ramp(t, cue(3) + 0.2, cue(3) + 1.0, BACK);
  const spec = win(t, cue(4) + 0.1, cue(5) - 0.1, 0.8, 0.5);
  const scan = ramp(t, cue(5) + 0.1, cue(5) + 1.0);
  const mriPt = ramp(t, wordOf(5, 'enam') - 0.2, wordOf(5, 'enam') + 0.5, BACK);
  const img = ramp(t, cue(6) + 0.2, cue(6) + 3.2, EASE_IN_OUT);
  // baris 5: spin proton di dalam lubang magnet berpresesi; baris 6: gambar irisan tersusun baris demi baris
  const spins = ramp(t, cue(5) + 0.6, cue(5) + 1.6) * (1 - ramp(t, cue(6) + 0.2, cue(6) + 1.2));
  const rf = ramp(t, wordOf(5, 'enam') - 0.2, wordOf(5, 'enam') + 2.5);
  const elec = win(t, cue(0) + 0.2, cue(1) - 0.3, 0.6, 0.5);
  const a = t * 3;
  const PX = 420;
  const PY = 560;
  const tipX = PX + 60 * Math.cos(a) * field;
  const tipY = PY - 110 + 18 * Math.sin(a) * field;
  const spath = Array.from({length: 401}, (_, k) => {
    const d = 4.5 - (k / 400) * 4;
    // luas puncak sebanding jumlah H: CH₃ (3) : CH₂ (2) : OH (1); jumlah koefisien triplet 4, kuartet 8
    const y = peak(d, 1.22, 3) * (3 / 4) + peak(d, 3.69, 4) * (2 / 8) + peak(d, 2.6, 1) * 1;
    return `${k ? 'L' : 'M'}${(360 + (k / 400) * 1200).toFixed(1)},${(760 - y * 200).toFixed(1)}`;
  }).join(' ');
  const dx = (d: number) => 360 + ((4.5 - d) / 4) * 1200;
  return (
    <AbsoluteFill>
      <Stage>
        {/* proton berspin */}
        <g opacity={proton}>
          <g opacity={field}>
            {[-1, 0, 1].map((k) => (
              <line key={k} x1={PX + k * 150} y1={800} x2={PX + k * 150} y2={330} stroke={C.blue} strokeWidth={3} opacity={0.35} markerEnd="url(#arrow-cyan)" />
            ))}
            <Label x={PX + 230} y={350} size={30} color={C.cyan} font="serif" italic weight={600}>
              B
            </Label>
            <ellipse cx={PX} cy={PY - 110} rx={60} ry={18} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="5 5" />
          </g>
          {/* baris 0: elektron punya spin ½ — proton juga */}
          <g opacity={elec}>
            <Electron x={PX + 330} y={PY} r={30} label />
            <line x1={PX + 330} y1={PY + 50} x2={PX + 330} y2={PY - 70} stroke={C.gold} strokeWidth={6} strokeLinecap="round" markerEnd="url(#arrow-gold)" />
            <Label x={PX + 330} y={PY + 100} size={26} color={C.muted}>
              spin ½ (elektron)
            </Label>
          </g>
          <circle cx={PX} cy={PY} r={60} fill="url(#soft-red)" opacity={0.6} />
          <circle cx={PX} cy={PY} r={34} fill={C.red} />
          <text x={PX} y={PY + 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={30} fontWeight={700} fill="#fff">
            p⁺
          </text>
          <line x1={PX} y1={PY} x2={tipX} y2={tipY} stroke={C.gold} strokeWidth={7} strokeLinecap="round" />
          <circle cx={tipX} cy={tipY} r={9} fill={C.gold} />
          <Label x={PX} y={PY + 100} size={26} color={C.muted}>
            spin ½ (inti ¹H)
          </Label>
          {/* dua tingkat */}
          <g opacity={field}>
            <line x1={620} y1={470} x2={800} y2={470} stroke={C.violet} strokeWidth={5} />
            <line x1={620} y1={640} x2={800} y2={640} stroke={C.mint} strokeWidth={5} />
            <line x1={710} y1={630} x2={710} y2={482} stroke={C.gold} strokeWidth={3} markerEnd="url(#arrow-gold)" />
            <Label x={830} y={555} size={28} color={C.gold} anchor="start" font="serif" italic>
              ΔE = hν
            </Label>
            <Label x={710} y={440} size={24} color={C.violet}>
              ↓ melawan medan
            </Label>
            <Label x={710} y={675} size={24} color={C.mint}>
              ↑ searah medan
            </Label>
          </g>
        </g>
        {/* grafik ν terhadap B */}
        <g opacity={plot}>
          <line x1={PL.x} y1={PL.y} x2={PL.x + PL.w + 20} y2={PL.y} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <line x1={PL.x} y1={PL.y} x2={PL.x} y2={PL.y - PL.h - 20} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={PL.x + PL.w + 20} y={PL.y + 34} size={22} color={C.muted} anchor="end">
            B (tesla)
          </Label>
          <Label x={PL.x + 12} y={PL.y - PL.h - 30} size={22} color={C.muted} anchor="start">
            ν (MHz)
          </Label>
          <line x1={px(0)} y1={py(0)} x2={px(10)} y2={py(10 * GAMMA)} stroke={C.gold} strokeWidth={4} />
          {[
            {b: 1.5, label: '1,5 T · ≈ 64 MHz', p: ramp(t, cue(2) + 2.0, cue(2) + 2.6, BACK)},
            {b: 3, label: '3 T · ≈ 128 MHz', p: ramp(t, cue(2) + 2.6, cue(2) + 3.2, BACK)},
            {b: 9.4, label: 'NMR 400 MHz · 9,4 T', p: nmrPt},
          ].map((q) => (
            <g key={q.b} opacity={q.p}>
              <circle cx={px(q.b)} cy={py(q.b * GAMMA)} r={10} fill={C.gold} filter="url(#glow)" />
              <Label x={px(q.b) + (q.b > 5 ? -18 : 18)} y={py(q.b * GAMMA) - 26} size={22} color={C.ink} anchor={q.b > 5 ? 'end' : 'start'}>
                {q.label}
              </Label>
            </g>
          ))}
        </g>
        {/* spektrum NMR etanol (skematis) */}
        <g opacity={spec}>
          <line x1={360} y1={760} x2={1560} y2={760} stroke={C.muted} strokeWidth={2} />
          {[4, 3, 2, 1].map((d) => (
            <Label key={d} x={dx(d)} y={790} size={22} color={C.muted} font="mono">
              {`${d}`}
            </Label>
          ))}
          <Label x={960} y={828} size={22} color={C.muted}>
            pergeseran kimia δ (ppm) · CH₃CH₂OH, skematis
          </Label>
          <path d={spath} fill="none" stroke={C.mint} strokeWidth={4} filter="url(#glow)" />
          <Label x={dx(3.69)} y={570} size={28} color={C.amber} weight={700}>
            CH₂ (2H)
          </Label>
          <Label x={dx(2.6)} y={520} size={28} color={C.cyan} weight={700}>
            OH (1H)
          </Label>
          <Label x={dx(1.22)} y={420} size={28} color={C.violet} weight={700}>
            CH₃ (3H)
          </Label>
        </g>
        {/* MRI */}
        <g opacity={scan}>
          <circle cx={600} cy={560} r={230} fill="none" stroke="#2a3558" strokeWidth={70} />
          <circle cx={600} cy={560} r={230} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} />
          <circle cx={600} cy={560} r={160} fill="rgba(5,8,18,0.9)" />
          {/* irisan kepala skematis */}
          {/* spin proton di dalam lubang magnet, berpresesi pada ≈ 64 MHz (diperlambat) */}
          <g opacity={spins}>
            {Array.from({length: 16}, (_, k) => {
              const gx = 600 + ((k % 4) - 1.5) * 70;
              const gy = 560 + (Math.floor(k / 4) - 1.5) * 70;
              const a = t * 3 + k * 0.7;
              const tilt = 0.25 + 0.75 * rf;
              return (
                <g key={k}>
                  <circle cx={gx} cy={gy + 14} r={8} fill={C.red} />
                  <line x1={gx} y1={gy + 14} x2={gx + 18 * tilt * Math.cos(a)} y2={gy - 18 + 6 * tilt * Math.sin(a)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
                </g>
              );
            })}
          </g>
          {/* pulsa gelombang radio ≈ 64 MHz masuk ke lubang magnet */}
          <g opacity={rf * (1 - img)}>
            <path
              d={Array.from({length: 81}, (_, j) => `${j ? 'L' : 'M'}${(880 + j * 2).toFixed(1)},${(560 - 18 * Math.sin(j * 0.5 + t * 12)).toFixed(1)}`).join(' ')}
              fill="none"
              stroke={C.cyan}
              strokeWidth={4}
            />
            <Label x={960} y={505} size={24} color={C.cyan}>
              radio ≈ 64 MHz
            </Label>
          </g>
          <defs>
            <clipPath id="mri-scan">
              <rect x={440} y={400} width={320} height={320 * img} />
            </clipPath>
          </defs>
          <g opacity={img > 0 ? 1 : 0} clipPath="url(#mri-scan)">
            <ellipse cx={600} cy={560} rx={110} ry={135} fill="#cfd6e6" opacity={0.85} />
            <ellipse cx={600} cy={560} rx={95} ry={118} fill="#8c96b0" />
            <path d="M600,445 L600,675" stroke="#5a6480" strokeWidth={4} />
            {[-1, 1].map((s) => (
              <ellipse key={s} cx={600 + s * 45} cy={555} rx={30} ry={60} fill="#b8c1d8" opacity={0.8} />
            ))}
            <ellipse cx={600} cy={560} rx={14} ry={30} fill="#2a2f40" />
          </g>
          {img > 0 && img < 1 ? <line x1={460} y1={400 + 320 * img} x2={740} y2={400 + 320 * img} stroke={C.cyan} strokeWidth={3} /> : null}
          <Label x={600} y={830} size={24} color={C.muted}>
            ilustrasi skematis
          </Label>
          <g opacity={mriPt}>
            <rect x={1100} y={430} width={600} height={110 + 130 * ramp(t, cue(6) - 0.2, cue(6) + 0.4)} rx={24} fill="rgba(12,18,40,0.85)" stroke={C.cyan} strokeWidth={2} />
            <text x={1400} y={500} textAnchor="middle" fontFamily={FONT.mono} fontSize={36} fontWeight={600} fill={C.cyan}>
              1,5 T → ≈ 64 MHz
            </text>
            <text x={1400} y={560} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.ink} opacity={ramp(t, cue(6) + 0.2, cue(6) + 0.8)}>
              sinyal dari proton air &amp; lemak
            </text>
            <text x={1400} y={610} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.mint} fontWeight={700} opacity={ramp(t, wordOf(6, 'tanpa') - 0.2, wordOf(6, 'tanpa') + 0.4)}>
              tanpa sinar-X
            </text>
          </g>
        </g>
      </Stage>
      <Formula x={960} y={250} p={slot(t, cue(2), cue(4) - 0.05)} accent={C.gold} caption="frekuensi resonansi proton: γ/2π ≈ 42,58 MHz per tesla">
        <V>ν</V>&nbsp;=&nbsp;
        <Frac n={<V>γ</V>} d={<>2<V>π</V></>} />
        <V>B</V>
        <Sub>0</Sub>
      </Formula>
      <Badge x={960} y={250} text="NMR: LINGKUNGAN KIMIA MENGGESER ν" color={C.mint} opacity={slot(t, cue(4) + 0.2, cue(5) - 0.05, 0.5)} />
      <Badge x={960} y={250} text="MRI: PRINSIP SAMA DI RUMAH SAKIT" color={C.cyan} opacity={ramp(t, cue(5) - 0.05, cue(5) + 0.55, BACK)} />
    </AbsoluteFill>
  );
};
