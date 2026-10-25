import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot, win} from '../anim';
import {Badge, Formula, Frac, Label, Stage, Sqrt, Sub, Sup, V} from '../components/primitives';
import {id} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 2: normalisasi. Kiri: kotak 0..L dengan sin dan luas sin²; kanan: kartu rumus.
// Akhir: tiga syarat fungsi gelombang yang "berperilaku baik".
const P = {x: 200, y: 730, w: 720, sy: 150};

const curve = (f: (u: number) => number, sy: number, n = 200) =>
  Array.from({length: n + 1}, (_, k) => `${k ? 'L' : 'M'}${(P.x + (k / n) * P.w).toFixed(1)},${(P.y - f(k / n) * sy).toFixed(1)}`).join(' ');

// rapat peluang umum (sebelum contoh sinus) dan luas kumulatifnya (dinormalisasi: total = 1)
const g = (u: number) => Math.exp(-(((u - 0.5) / 0.18) ** 2)) * 1.9;
const G_CDF = (() => {
  const n = 400;
  const acc = [0];
  for (let k = 1; k <= n; k++) acc.push(acc[k - 1] + (g((k - 0.5) / n) * 1) / n);
  return acc.map((v) => v / acc[n]);
})();
const cdf = (u: number) => G_CDF[Math.max(0, Math.min(400, Math.round(u * 400)))];

const BAD = [
  {need: 'bernilai tunggal', bad: 'bercabang', x: 380},
  {need: 'kontinu', bad: 'melompat', x: 960},
  {need: 'dapat dinormalisasi', bad: 'membesar tanpa batas', x: 1540},
];

const badPath = (i: number, cx: number, cy: number) => {
  const w = 300;
  if (i === 0) {
    // spiral/akar ganda: satu x punya dua nilai
    return Array.from({length: 121}, (_, k) => {
      const a = (k / 120) * Math.PI * 3.2;
      const r = 20 + a * 13;
      return `${k ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a) * 0.8).toFixed(1)}`;
    }).join(' ');
  }
  if (i === 1) return `M${cx - w / 2},${cy + 40} C${cx - 80},${cy + 40} ${cx - 40},${cy + 10} ${cx},${cy + 10} M${cx},${cy - 70} C${cx + 40},${cy - 70} ${cx + 80},${cy - 50} ${cx + w / 2},${cy - 60}`;
  return Array.from({length: 61}, (_, k) => {
    const u = k / 60;
    return `${k ? 'L' : 'M'}${(cx - w / 2 + u * w).toFixed(1)},${(cy + 70 - Math.min(190, 6 * Math.exp(u * 3.6))).toFixed(1)}`;
  }).join(' ');
};

export const Norm: React.FC = () => {
  const {t, cue} = useScene();
  const partA = 1 - ramp(t, cue(6) - 0.4, cue(6) + 0.4, EASE_IN_OUT);
  const box = ramp(t, cue(2) - 0.3, cue(2) + 0.6);
  // luas di bawah |ψ|² disapu dari kiri ke kanan; penghitung = peluang kumulatif → tepat 1
  const fill = ramp(t, cue(0) + 1.4, cue(1) + 1.2, EASE_IN_OUT);
  const gCurve = ramp(t, 0.1, cue(0) + 0.9, EASE_IN_OUT);
  // amplitudo: 1 (belum ternormalisasi) → √2 (L = 1) setelah dikalikan √(2/L)
  const scaleUp = ramp(t, cue(3) + 2.2, cue(3) + 3.6, EASE_IN_OUT) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.6));
  const big = ramp(t, cue(4) + 0.2, cue(4) + 1.4, EASE_IN_OUT) * (1 - ramp(t, cue(6) - 0.5, cue(6)));
  const amp = mix(1, Math.SQRT2, scaleUp) * mix(1, 2.2, big);
  const area = 0.5 * amp * amp; // luas sin² × amp² untuk L = 1
  const fUser = (u: number) => amp * Math.sin(Math.PI * u);
  const areaPath = `${curve((u) => fUser(u) ** 2 / Math.max(1, amp * amp / 2.4), P.sy * 0.7)} L${P.x + P.w},${P.y} L${P.x},${P.y} Z`;
  const showArea = t >= cue(2) - 0.3;
  const generic = 1 - box;
  const bad = ramp(t, cue(6) + 0.2, cue(6) + 1.0);
  const okLbl = ramp(t, cue(7) - 0.2, cue(7) + 0.6);
  const xs = BAD.map((_, i) => ramp(t, cue(8) + 0.3 + i * 0.6, cue(8) + 0.9 + i * 0.6, BACK));
  const gArea = (() => {
    const n = 160;
    const pts: string[] = [];
    for (let k = 0; k <= n; k++) {
      const u = (k / n) * fill;
      pts.push(`${(P.x + u * P.w).toFixed(1)},${(P.y - g(u) * P.sy).toFixed(1)}`);
    }
    return `M${P.x},${P.y} L${pts.join(' L')} L${(P.x + fill * P.w).toFixed(1)},${P.y} Z`;
  })();
  const shownArea = t < cue(2) - 0.3 ? cdf(fill) : t < cue(4) ? area : 27;
  const done = t < cue(2) - 0.3 && fill > 0.995;
  // satu slot kartu rumus di kanan
  const S = [cue(0) + 0.3, cue(2) - 0.05, cue(3) + 2.0, cue(4) - 0.05, cue(6) - 0.2];
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={partA}>
          <line x1={P.x - 30} y1={P.y} x2={P.x + P.w + 40} y2={P.y} stroke={C.muted} strokeWidth={2} />
          <g opacity={generic}>
            {fill > 0 ? <path d={gArea} fill={C.violet} opacity={0.42} /> : null}
            <path d={curve(g, P.sy)} fill="none" stroke={C.violet} strokeWidth={5} strokeDasharray="1200 1200" strokeDashoffset={1200 * (1 - gCurve)} pathLength={1200} />
            {fill > 0.001 && fill < 0.999 ? (
              <line x1={P.x + fill * P.w} y1={P.y + 8} x2={P.x + fill * P.w} y2={P.y - 2.05 * P.sy + 40} stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" />
            ) : null}
            <Label x={P.x + P.w / 2} y={P.y - 2.05 * P.sy} size={30} color={C.violet} font="serif" italic opacity={gCurve}>
              |ψ|²
            </Label>
          </g>
          <g opacity={box}>
            {[P.x, P.x + P.w].map((x) => (
              <line key={x} x1={x} y1={P.y - 360} x2={x} y2={P.y + 10} stroke={C.ink} strokeWidth={5} />
            ))}
            <Label x={P.x} y={P.y + 34} size={24} color={C.muted} font="mono">
              0
            </Label>
            <Label x={P.x + P.w} y={P.y + 34} size={24} color={C.muted} font="mono">
              L
            </Label>
            {showArea ? <path d={areaPath} fill={C.gold} opacity={0.3} /> : null}
            {showArea ? (
              <Label x={P.x + P.w / 2} y={P.y - 34} size={24} color={C.gold} opacity={0.95}>
                {big > 0.5 ? 'luas di bawah |f|²' : scaleUp > 0.5 ? 'luas di bawah |ψ|²' : 'luas di bawah sin²'}
              </Label>
            ) : null}
            <path d={curve(fUser, P.sy * 0.7 / Math.max(1, amp / 1.6))} fill="none" stroke={C.gold} strokeWidth={5} />
            <Label x={P.x + P.w - 30} y={P.y - 330} size={26} color={C.gold} anchor="end" font="serif" italic>
              {big > 0.5 ? 'f(x), belum diskalakan' : scaleUp > 0.5 ? 'ψ = √(2/L) sin(πx/L)' : 'f = sin(πx/L)'}
            </Label>
          </g>
          {/* penghitung luas */}
          <g opacity={Math.max(generic * ramp(t, cue(0) + 1.0, cue(0) + 1.6), box)}>
            <rect x={P.x + P.w / 2 - 190} y={P.y + 60} width={380} height={64} rx={14} fill="rgba(12,18,40,0.85)" stroke={shownArea > 26 ? C.red : done ? C.mint : C.gold} strokeWidth={2} />
            <text x={P.x + P.w / 2} y={P.y + 92} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={30} fontWeight={600} fill={shownArea > 26 ? C.red : done ? C.mint : C.gold}>
              {t < cue(2) - 0.3 ? (done ? 'peluang total = 1 ✓' : `peluang = ${id(shownArea, 2)}`) : shownArea > 26 ? 'norma = 27' : Math.abs(shownArea - 1) < 0.005 ? 'luas = 1' : `luas = ${id(shownArea, 2)} L`}
            </text>
          </g>
        </g>
        {/* tiga syarat */}
        <g opacity={bad}>
          {BAD.map((b, i) => (
            <g key={i}>
              <rect x={b.x - 220} y={300} width={440} height={420} rx={24} fill="rgba(12,18,40,0.7)" stroke={C.faint} strokeWidth={2} />
              <path d={badPath(i, b.x, 520)} fill="none" stroke={xs[i] > 0.5 ? C.red : C.cyan} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
              <g opacity={okLbl}>
                <Label x={b.x} y={350} size={32} color={C.mint} weight={700}>
                  {`✓ ${b.need}`}
                </Label>
              </g>
              <g opacity={xs[i]} transform={`translate(${b.x} 520) scale(${0.6 + 0.4 * xs[i]}) translate(${-b.x} -520)`}>
                <line x1={b.x - 70} y1={450} x2={b.x + 70} y2={590} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                <line x1={b.x + 70} y1={450} x2={b.x - 70} y2={590} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                <Label x={b.x} y={680} size={28} color={C.red} weight={700}>
                  {`✗ ${b.bad}`}
                </Label>
              </g>
            </g>
          ))}
        </g>
      </Stage>
      <Formula x={1400} y={430} p={slot(t, S[0], S[1])} accent={C.gold} caption="syarat normalisasi: peluang total = 1">
        <span style={{fontSize: '1.2em'}}>∫</span>&thinsp;|<V>ψ</V>|<Sup>2</Sup>&thinsp;<V>dτ</V>&nbsp;=&nbsp;1
      </Formula>
      <Formula x={1400} y={430} p={slot(t, S[1], S[2])} accent={C.gold} caption="luas di bawah sin² pada 0 < x < L">
        <span style={{fontSize: '1.2em'}}>∫</span>
        <Sub>0</Sub>
        <Sup>L</Sup>&thinsp;sin<Sup>2</Sup>
        <Frac n={<V>πx</V>} d={<V>L</V>} />
        <V>dx</V>&nbsp;=&nbsp;
        <Frac n={<V>L</V>} d="2" />
      </Formula>
      <Formula x={1400} y={430} p={slot(t, S[2], S[3])} accent={C.mint} caption="dikalikan konstanta normalisasi">
        <V>ψ</V>(<V>x</V>)&nbsp;=&nbsp;
        <Sqrt>
          <Frac n="2" d={<V>L</V>} size={0.75} />
        </Sqrt>
        &thinsp;sin&thinsp;
        <Frac n={<V>πx</V>} d={<V>L</V>} />
      </Formula>
      <Formula x={1400} y={430} p={slot(t, S[3], S[4])} accent={C.red} caption="norma 27 → bagi dengan akar 27">
        <V>ψ</V>&nbsp;=&nbsp;
        <Frac n={<V>f</V>} d={<Sqrt>27</Sqrt>} />
      </Formula>
      <Badge x={1400} y={640} text="BUKAN 27 PARTIKEL" color={C.red} opacity={win(t, cue(5) - 0.2, cue(6) - 0.2, 0.5, 0.4)} />
    </AbsoluteFill>
  );
};
