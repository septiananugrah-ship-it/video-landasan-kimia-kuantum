import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, slot, win} from '../anim';
import {Badge, Formula, Frac, Label, Stage, V} from '../components/primitives';
import {Electron, PhotonPacket, wlColor} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 14: spektroskopi. Tingkat energi H (Eₙ = −13,6/n² eV), transisi 3 → 2 memancarkan Hα 656 nm,
// garis Balmer, lalu peta daerah spektrum (rotasi · vibrasi · elektron) dan "sidik jari".
const LV = {x0: 200, x1: 640, yTop: 330, yBot: 790};
const ey = (e: number) => LV.yTop + (-e / 13.6) * (LV.yBot - LV.yTop);
const En = (n: number) => -13.6 / (n * n);
const SP = {x0: 1000, x1: 1760, y: 470, h: 120, l0: 380, l1: 720};
const sx = (nm: number) => SP.x0 + ((nm - SP.l0) / (SP.l1 - SP.l0)) * (SP.x1 - SP.x0);
const BALMER = [656.3, 486.1, 434.0, 410.2];
// "sidik jari" skematis: pola garis serapan dua molekul; sampel cocok dengan molekul A
const FP = {x0: 380, x1: 1560, h: 90};
const fpLines = (seed: number) =>
  Array.from({length: 24}, (_, k) => ({x: FP.x0 + 10 + rand(seed * 97.1 + k * 3.13) * (FP.x1 - FP.x0 - 20), h: 22 + rand(seed * 41.7 + k * 1.71) * 60}));
const FP_STRIPS = [
  {name: 'molekul A', seed: 1, y: 430, col: C.mint},
  {name: 'molekul B', seed: 2, y: 555, col: C.violet},
  {name: 'sampel', seed: 1, y: 700, col: C.gold},
];

export const Spectra: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const part1 = ramp(t, cue(0) + 0.2, cue(0) + 1.2) * (1 - ramp(t, cue(5) - 0.5, cue(5)));
  // serapan (baris 1): foton datang, elektron naik 2 → 3
  const absIn = ramp(t, cue(1) + 0.6, cue(1) + 2.2, EASE_IN_OUT);
  const up = ramp(t, cue(1) + 2.1, cue(1) + 2.7, EASE_IN_OUT);
  // pancaran (baris 3): elektron turun 3 → 2, foton merah keluar
  const down = ramp(t, cue(3) + 0.4, cue(3) + 1.0, EASE_IN_OUT);
  const emit = ramp(t, cue(3) + 0.9, cue(3) + 2.8, EASE_IN_OUT);
  const level = t < cue(3) + 0.4 ? mix(2, 3, up) : mix(3, 2, down);
  const lines = ramp(t, cue(3) + 2.4, cue(3) + 3.4);
  const others = ramp(t, cue(4) + 0.6, cue(4) + 2.0);
  const osc = win(t, cue(2), cue(3), 0.5, 0.4);
  const part2 = ramp(t, cue(5) + 0.1, cue(5) + 1.0);
  // pita daerah spektrum hilang dulu, baru panel sidik jari muncul (tidak bertumpuk)
  const bandsOut = ramp(t, cue(6) - 0.1, cue(6) + 0.4, EASE_IN_OUT);
  const fp = ramp(t, cue(6) + 0.4, cue(6) + 1.4, EASE_IN_OUT);
  const scan = ramp(t, cue(6) + 1.8, cue(6) + 4.0, EASE_IN_OUT);
  const match = ramp(t, cue(6) + 4.0, cue(6) + 4.6, BACK);
  const ladderIn = (n: number) => ramp(t, cue(0) + 0.2 + n * 0.25, cue(0) + 0.9 + n * 0.25);
  const bands = [
    {name: 'gelombang mikro', what: 'rotasi', x0: 160, x1: 700, col: C.cyan},
    {name: 'inframerah', what: 'vibrasi', x0: 700, x1: 1240, col: C.red},
    {name: 'tampak & UV', what: 'elektron', x0: 1240, x1: 1760, col: C.violet},
  ];
  const bandP = bands.map((_, i) => ramp(t, wordOf(5, ['elektron', 'vibrasi', 'rotasi'][2 - i]) - 0.3, wordOf(5, ['elektron', 'vibrasi', 'rotasi'][2 - i]) + 0.5, BACK));
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={part1}>
          {/* tingkat energi atom H */}
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <g key={n}>
              <line x1={LV.x0} y1={ey(En(n))} x2={mix(LV.x0, LV.x1, ladderIn(n))} y2={ey(En(n))} stroke={n === 2 || n === 3 ? C.ink : C.faint} strokeWidth={n === 2 || n === 3 ? 4 : 2} />
              {n <= 3 ? (
                <Label x={LV.x0 - 20} y={ey(En(n))} size={22} color={C.muted} anchor="end" font="mono">
                  {`n = ${n}`}
                </Label>
              ) : null}
            </g>
          ))}
          <Label x={LV.x1 + 20} y={ey(En(2))} size={22} color={C.muted} anchor="start" font="mono">
            −3,40 eV
          </Label>
          <Label x={LV.x1 + 20} y={ey(En(3))} size={22} color={C.muted} anchor="start" font="mono">
            −1,51 eV
          </Label>
          <Label x={LV.x1 + 20} y={ey(En(1))} size={22} color={C.muted} anchor="start" font="mono">
            −13,6 eV
          </Label>
          <Electron x={(LV.x0 + LV.x1) / 2} y={ey(En(level))} r={14} opacity={ladderIn(2)} />
          <Label x={(LV.x0 + LV.x1) / 2} y={600} size={26} color={C.gold} opacity={win(t, cue(0) + 1.4, cue(1) - 0.3, 0.6, 0.4)}>
            tiap garis = satu keadaan eigen energi
          </Label>
          {/* foton masuk (serapan) */}
          {absIn > 0 && absIn < 1 ? <PhotonPacket x={mix(60, (LV.x0 + LV.x1) / 2 - 40, absIn)} y={ey(En(2.5))} wavelength={34} color={wlColor(656)} len={200} amp={22} phase={-t * 14} /> : null}
          {/* foton keluar (pancaran) */}
          {emit > 0 && emit < 1 ? <PhotonPacket x={mix((LV.x0 + LV.x1) / 2 + 60, sx(656.3) - 60, emit)} y={mix(ey(En(2.5)), SP.y + SP.h / 2, emit)} wavelength={34} color={wlColor(656)} len={200} amp={22} phase={-t * 14} angle={(Math.atan2(SP.y + SP.h / 2 - ey(En(2.5)), sx(656.3) - LV.x1) * 180) / Math.PI} /> : null}
          <g opacity={osc}>
            <ellipse cx={(LV.x0 + LV.x1) / 2} cy={(ey(En(2)) + ey(En(3))) / 2} rx={70 + 20 * Math.sin(t * 9)} ry={34} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" />
            <Label x={LV.x1 + 20} y={(ey(En(2)) + ey(En(3))) / 2} size={24} color={C.gold} anchor="start">
              superposisi: muatan berayun
            </Label>
          </g>
          {/* spektrum Balmer */}
          <rect x={SP.x0} y={SP.y} width={SP.x1 - SP.x0} height={SP.h} rx={8} fill="#05070f" stroke={C.faint} strokeWidth={2} />
          {BALMER.map((nm, i) => {
            const p = i === 0 ? lines : others;
            return <rect key={nm} x={sx(nm) - 4} y={SP.y + 6} width={8} height={SP.h - 12} fill={wlColor(nm)} opacity={p} filter="url(#glow)" />;
          })}
          {[400, 500, 600, 700].map((nm) => (
            <Label key={nm} x={sx(nm)} y={SP.y + SP.h + 30} size={20} color={C.muted} font="mono">
              {`${nm}`}
            </Label>
          ))}
          <Label x={(SP.x0 + SP.x1) / 2} y={SP.y + SP.h + 64} size={22} color={C.muted}>
            panjang gelombang (nm) · deret Balmer hidrogen
          </Label>
          <g opacity={lines}>
            <Label x={sx(656.3)} y={SP.y - 30} size={28} color={wlColor(656)} weight={700}>
              656 nm
            </Label>
          </g>
          <g opacity={ramp(t, cue(4) - 0.2, cue(4) + 0.6)}>
            <rect x={1180} y={680} width={400} height={80} rx={16} fill="rgba(12,18,40,0.9)" stroke={C.gold} strokeWidth={2} />
            <text x={1380} y={720} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={30} fontWeight={600} fill={C.gold}>
              E = 1,89 eV
            </text>
          </g>
        </g>
        {/* daerah spektrum */}
        <g opacity={part2 * (1 - bandsOut)}>
          {bands.map((b, i) => (
            <g key={i} opacity={bandP[i]}>
              <rect x={b.x0 + 6} y={440} width={b.x1 - b.x0 - 12} height={90} rx={14} fill={b.col} opacity={0.22} stroke={b.col} strokeWidth={2} />
              <Label x={(b.x0 + b.x1) / 2} y={485} size={30} color={b.col} weight={700}>
                {b.name}
              </Label>
              <Label x={(b.x0 + b.x1) / 2} y={580} size={28} color={C.ink}>
                {`→ ${b.what}`}
              </Label>
            </g>
          ))}
          {/* ikon gerak */}
          <g opacity={bandP[0]}>
            {(() => {
              const a = t * 1.6;
              const cx = 430;
              const cy = 690;
              return (
                <g>
                  <line x1={cx - 60 * Math.cos(a)} y1={cy - 20 * Math.sin(a)} x2={cx + 60 * Math.cos(a)} y2={cy + 20 * Math.sin(a)} stroke="#8b97b8" strokeWidth={8} />
                  <circle cx={cx - 60 * Math.cos(a)} cy={cy - 20 * Math.sin(a)} r={22} fill={C.red} />
                  <circle cx={cx + 60 * Math.cos(a)} cy={cy + 20 * Math.sin(a)} r={16} fill="#f2f5ff" />
                </g>
              );
            })()}
          </g>
          <g opacity={bandP[1]}>
            {(() => {
              const d = 70 + 18 * Math.sin(t * 7);
              return (
                <g>
                  <line x1={970 - d} y1={690} x2={970 + d} y2={690} stroke={C.gold} strokeWidth={5} strokeDasharray="6 4" />
                  <circle cx={970 - d} cy={690} r={22} fill={C.red} />
                  <circle cx={970 + d} cy={690} r={16} fill="#f2f5ff" />
                </g>
              );
            })()}
          </g>
          <g opacity={bandP[2]}>
            {[0, 1].map((k) => (
              <line key={k} x1={1430} y1={720 - k * 70} x2={1570} y2={720 - k * 70} stroke={C.ink} strokeWidth={4} />
            ))}
            <Electron x={1500} y={mix(720, 650, 0.5 + 0.5 * Math.sin(t * 2.4))} r={13} />
          </g>
        </g>
        {/* sidik jari: tiap molekul punya pola garis sendiri; sampel dikenali dengan mencocokkan pola */}
        <g opacity={fp}>
          {FP_STRIPS.map((st, i) => {
            const ok = i === 0 ? match : 0;
            return (
              <g key={st.name}>
                <rect x={FP.x0} y={st.y} width={FP.x1 - FP.x0} height={FP.h} rx={10} fill="rgba(5,7,15,0.92)" stroke={ok > 0.5 || i === 2 ? st.col : C.faint} strokeWidth={ok > 0.5 ? 4 : 2} />
                {fpLines(st.seed).map((l, k) => (
                  <rect key={k} x={l.x - 2} y={st.y + FP.h - 6 - l.h} width={4} height={l.h} fill={st.col} opacity={i === 1 ? 0.6 + 0.3 * (1 - match) : 0.9} />
                ))}
                <Label x={FP.x0 - 24} y={st.y + FP.h / 2} size={26} color={st.col} weight={700} anchor="end">
                  {st.name}
                </Label>
              </g>
            );
          })}
          {/* garis pindai yang membandingkan sampel dengan pustaka */}
          {scan > 0 && scan < 1 ? (
            <line x1={mix(FP.x0, FP.x1, scan)} y1={420} x2={mix(FP.x0, FP.x1, scan)} y2={FP_STRIPS[2].y + FP.h + 10} stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" />
          ) : null}
          <g opacity={match}>
            <Label x={FP.x1 + 24} y={FP_STRIPS[0].y + FP.h / 2} size={30} color={C.mint} weight={700} anchor="start">
              ✓ cocok
            </Label>
            <Label x={FP.x1 + 24} y={FP_STRIPS[1].y + FP.h / 2} size={30} color={C.red} weight={700} anchor="start">
              ✗
            </Label>
          </g>
          <Label x={960} y={828} size={22} color={C.muted}>
            pola garis skematis
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={250} p={slot(t, cue(1) + 0.3, cue(3) - 0.05)} accent={C.gold} caption="syarat resonansi: energi foton = selisih tingkat energi">
        Δ<V>E</V>&nbsp;=&nbsp;<V>hν</V>&nbsp;=&nbsp;
        <Frac n={<V>hc</V>} d={<V>λ</V>} />
      </Formula>
      <Formula x={960} y={250} p={slot(t, cue(3) - 0.05, cue(5) - 0.1)} accent={C.red} caption="transisi n = 3 → n = 2 (Hα)">
        <V>λ</V>&nbsp;=&nbsp;
        <Frac n={<V>hc</V>} d={<>Δ<V>E</V></>} />
        &nbsp;=&nbsp;
        <Frac n="1240 eV·nm" d="1,89 eV" />
        &nbsp;≈&nbsp;656 nm
      </Formula>
      <Badge x={960} y={250} text="TIAP GERAK PUNYA DAERAH SPEKTRUM" color={C.cyan} opacity={slot(t, cue(5) + 0.2, cue(6) - 0.05, 0.5)} />
      <Badge x={960} y={250} text="SPEKTRUM = SIDIK JARI MOLEKUL" color={C.mint} opacity={ramp(t, cue(6) - 0.05, cue(6) + 0.55, BACK)} />
    </AbsoluteFill>
  );
};
