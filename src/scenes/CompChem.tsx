import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, slot} from '../anim';
import {Atom, Badge, Bond, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 16: kimia komputasi. Molekul kafein (skematis) → komputer memakai keenam aturan →
// fungsi basis Gauss → iterasi energi menurun hingga konvergen → rapat elektron (DFT) →
// corong penyaringan kandidat molekul untuk farmasi, katalis, dan baterai.
const S = 92; // panjang ikatan (px)
const MC = {x: 560, y: 540};
const hex = (k: number) => [Math.cos(((30 + 60 * k) * Math.PI) / 180), Math.sin(((30 + 60 * k) * Math.PI) / 180)] as const;
// kerangka kafein (1,3,7-trimetilxantin; atom H tidak digambar), posisi dalam satuan panjang ikatan
const ATOMS: {p: readonly [number, number]; el: string}[] = [
  {p: hex(0), el: 'C'},
  {p: hex(1), el: 'C'},
  {p: hex(2), el: 'N'},
  {p: hex(3), el: 'C'},
  {p: hex(4), el: 'N'},
  {p: hex(5), el: 'C'},
  {p: [1.68, 0.95], el: 'N'},
  {p: [2.25, 0], el: 'C'},
  {p: [1.68, -0.95], el: 'N'},
  {p: [0, 2], el: 'O'},
  {p: [-1.73, -1], el: 'O'},
  {p: [-1.73, 1], el: 'C'},
  {p: [0, -2], el: 'C'},
  {p: [2.1, 1.95], el: 'C'},
];
const BONDS: [number, number, number][] = [
  [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 2], [0, 6, 1], [6, 7, 1], [7, 8, 2], [8, 5, 1],
  [1, 9, 2], [3, 10, 2], [2, 11, 1], [4, 12, 1], [6, 13, 1],
];
const ap = (i: number) => ({x: MC.x + ATOMS[i].p[0] * S, y: MC.y - ATOMS[i].p[1] * S});
const g = (u: number, c: number, w: number) => Math.exp(-(((u - c) / w) ** 2));

/* ------------------------------------------------------------------ */
/* Corong penyaringan (baris 5)                                         */
/* ------------------------------------------------------------------ */
const FN = {cx: 960, top: 340, neck: 640, bottom: 700, half: 320, neckHalf: 56};
/** Setengah lebar bagian dalam corong pada ketinggian y. */
const halfW = (y: number) => (y <= FN.top ? FN.half : y >= FN.neck ? FN.neckHalf : mix(FN.half, FN.neckHalf, (y - FN.top) / (FN.neck - FN.top)));
const BAND_Y = 500; // pita "perhitungan kuantum"
const N_CAND = 34;
const FLY = 2.8; // detik tiap kandidat dari atas corong sampai keluar
const passes = (k: number) => k % 6 === 3;

/** Ikon kandidat molekul: cincin heksagon kecil. */
const Hexa: React.FC<{x: number; y: number; r?: number; color: string; opacity?: number; spin?: number}> = ({x, y, r = 15, color, opacity = 1, spin = 0}) => (
  <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${spin})`}>
    <path
      d={Array.from({length: 6}, (_, k) => `${k ? 'L' : 'M'}${(r * Math.cos((k * Math.PI) / 3)).toFixed(1)},${(r * Math.sin((k * Math.PI) / 3)).toFixed(1)}`).join(' ') + ' Z'}
      fill={color}
      fillOpacity={0.25}
      stroke={color}
      strokeWidth={3}
    />
    <circle cx={r} cy={0} r={4} fill={color} />
  </g>
);

/** Ikon farmasi: kapsul obat dua warna. */
const PillIcon: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g transform={`translate(${x} ${y}) rotate(${-30 + 4 * Math.sin(t * 1.6)})`}>
    <path d="M-70,-26 L0,-26 L0,26 L-70,26 A26,26 0 0 1 -70,-26 Z" fill={C.red} />
    <path d="M0,-26 L70,-26 A26,26 0 0 1 70,26 L0,26 Z" fill="#f2f5ff" />
    <rect x={-92} y={-26} width={188} height={52} rx={26} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={2} />
    <rect x={-74} y={-18} width={60} height={8} rx={4} fill="#fff" opacity={0.35} />
  </g>
);

/** Ikon katalis: permukaan logam (kisi atom) dengan molekul yang menempel lalu bereaksi. */
const CatalystIcon: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  const ph = (t * 0.5) % 1; // daur: datang → menempel → lepas sebagai produk
  const my = ph < 0.4 ? mix(-80, -34, ph / 0.4) : ph < 0.7 ? -34 : mix(-34, -90, (ph - 0.7) / 0.3);
  const split = ph < 0.4 ? 0 : ph < 0.7 ? (ph - 0.4) / 0.3 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1].map((row) =>
        Array.from({length: 5 - row}, (_, k) => (
          <circle key={`${row}-${k}`} cx={-80 + row * 20 + k * 40} cy={row * 30} r={18} fill="#8b97b8" stroke="#c8d3ef" strokeWidth={2} />
        )),
      )}
      <circle cx={-14 - 14 * split} cy={my} r={13} fill={C.mint} opacity={ph > 0.9 ? (1 - ph) * 10 : 1} />
      <circle cx={14 + 14 * split} cy={my} r={13} fill={C.cyan} opacity={ph > 0.9 ? (1 - ph) * 10 : 1} />
      {split < 0.5 ? <line x1={-4} y1={my} x2={4} y2={my} stroke="#fff" strokeWidth={6} opacity={1 - split * 2} /> : null}
    </g>
  );
};

/** Ikon baterai: ion Li⁺ berpindah bolak-balik antara dua elektroda. */
const BatteryIcon: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-46} width={170} height={92} rx={14} fill="rgba(12,18,40,0.9)" stroke={C.amber} strokeWidth={4} />
    <rect x={80} y={-18} width={14} height={36} rx={4} fill={C.amber} />
    <rect x={-80} y={-36} width={16} height={72} rx={4} fill="#8b97b8" />
    <rect x={54} y={-36} width={16} height={72} rx={4} fill="#8b97b8" />
    {Array.from({length: 5}, (_, k) => {
      const ph = (Math.sin(t * 1.4 + k * 0.4) + 1) / 2;
      return <circle key={k} cx={mix(-52, 42, ph)} cy={-26 + k * 13} r={6} fill={C.gold} />;
    })}
    <text x={-5} y={-58} textAnchor="middle" fontFamily={FONT.sans} fontSize={22} fill={C.gold} fontWeight={700}>
      Li⁺
    </text>
  </g>
);

/** Ikon labu laboratorium untuk tahap sintesis. */
const FlaskIcon: React.FC<{x: number; y: number; fill: number}> = ({x, y, fill}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M-14,-56 L-14,-20 L-50,40 Q-54,50 -44,50 L44,50 Q54,50 50,40 L14,-20 L14,-56 Z`} fill="rgba(12,18,40,0.9)" stroke={C.mint} strokeWidth={4} />
    <clipPath id="flask-liquid">
      <path d={`M-14,-56 L-14,-20 L-50,40 Q-54,50 -44,50 L44,50 Q54,50 50,40 L14,-20 L14,-56 Z`} />
    </clipPath>
    <rect x={-60} y={50 - 60 * fill} width={120} height={60 * fill} fill={C.mint} opacity={0.55} clipPath="url(#flask-liquid)" />
    <rect x={-20} y={-64} width={40} height={10} rx={3} fill={C.mint} />
  </g>
);

export const CompChem: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const mol = ramp(t, cue(0) + 0.2, cue(0) + 1.2) * (1 - ramp(t, cue(5) - 0.5, cue(5)));
  // panel kanan berganti: pensil gagal (baris 0) → komputer + enam aturan (baris 1) → basis & iterasi (baris 2–4)
  const pencil = slot(t, cue(0) + 0.6, cue(1) + 0.1, 0.5, 0.45);
  const comp = slot(t, cue(1) + 0.1, cue(2) - 0.15, 0.5, 0.45);
  const basis = ramp(t, cue(2) - 0.15, cue(2) + 1.0);
  const sumP = ramp(t, cue(2) + 1.4, cue(2) + 2.8, EASE_IN_OUT);
  const iter = ramp(t, wordOf(2, 'diminimalkan') - 0.6, cue(3) + 1.0, EASE_IN_OUT);
  const dft = ramp(t, cue(3) + 0.2, cue(3) + 1.6);
  const funnel = ramp(t, cue(5) + 0.1, cue(5) + 1.0);
  const N_IT = 9;
  const E = (k: number) => -680 + 160 * Math.exp(-k / 1.3) + 10 * Math.exp(-k / 0.6) * Math.cos(k * 2.2);
  const shown = Math.floor(iter * N_IT) + (iter > 0 ? 1 : 0);
  const EP = {x: 1080, y: 790, w: 600, h: 200};
  const epx = (k: number) => EP.x + (k / (N_IT - 1)) * EP.w;
  const epy = (e: number) => EP.y - ((e + 690) / 190) * EP.h;
  const BP = {x: 1080, y: 470, w: 600, sy: 110};
  const bas = [
    {c: 0.32, w: 0.12, a: 0.55, col: C.cyan},
    {c: 0.5, w: 0.2, a: 0.8, col: C.violet},
    {c: 0.7, w: 0.1, a: -0.45, col: C.amber},
  ];
  const orb = (u: number) => bas.reduce((s, b) => s + b.a * g(u, b.c, b.w), 0);
  const partOut = 1 - ramp(t, cue(5) - 0.5, cue(5));
  // baris 1: enam aturan masuk ke komputer satu per satu
  const ruleIn = (k: number) => ramp(t, cue(1) + 0.8 + k * 0.45, cue(1) + 1.5 + k * 0.45, EASE_IN_OUT);
  // baris 5: ikon industri muncul saat namanya diucapkan; aliran kandidat mulai saat "perhitungan"
  const iconP = ['farmasi', 'katalis', 'baterai'].map((w) => ramp(t, wordOf(5, w) - 0.2, wordOf(5, w) + 0.5, BACK));
  const flow0 = wordOf(5, 'perhitungan') - 1.2;
  const lab = ramp(t, wordOf(5, 'disintesis') - 0.3, wordOf(5, 'disintesis') + 0.5);
  const arrived = Array.from({length: N_CAND}, (_, k) => k).filter((k) => passes(k) && t > flow0 + k * 0.26 + FLY).length;
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={mol}>
          {/* rapat elektron (DFT) */}
          <g opacity={dft}>
            {ATOMS.map((a, i) => {
              const q = ap(i);
              return <circle key={i} cx={q.x} cy={q.y} r={a.el === 'C' ? 70 : 80} fill={a.el === 'O' ? 'url(#soft-red)' : a.el === 'N' ? 'url(#soft-violet)' : 'url(#soft-cyan)'} opacity={0.5 + 0.08 * Math.sin(t * 2 + i)} />;
            })}
            <Label x={MC.x} y={MC.y + 270} size={30} color={C.cyan} font="serif" italic>
              ρ(r) — rapat elektron
            </Label>
          </g>
          {BONDS.map(([a, b, o], k) => {
            const A = ap(a);
            const B = ap(b);
            return <Bond key={k} x1={A.x} y1={A.y} x2={B.x} y2={B.y} order={o} width={10} />;
          })}
          {ATOMS.map((a, i) => {
            const q = ap(i);
            return <Atom key={i} x={q.x} y={q.y} el={a.el} r={a.el === 'C' ? 24 : 26} glow={0} />;
          })}
          <Label x={MC.x} y={300} size={26} color={C.muted}>
            kafein: 102 elektron, 24 inti (H tidak digambar)
          </Label>
          <g opacity={pencil}>
            <rect x={1040} y={420} width={660} height={240} rx={22} fill="rgba(12,18,40,0.85)" stroke={C.red} strokeWidth={2} />
            <text x={1370} y={500} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={40} fill={C.ink}>
              Ψ(r₁, r₂, …, r₁₀₂)
            </text>
            <text x={1370} y={560} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.muted}>
              306 koordinat ruang + spin
            </text>
            <text x={1370} y={620} textAnchor="middle" fontFamily={FONT.sans} fontSize={28} fill={C.red} fontWeight={700}>
              ✗ tidak bisa diselesaikan dengan pensil
            </text>
          </g>
          {/* baris 1: komputer menyelesaikan secara pendekatan dengan keenam aturan */}
          <g opacity={comp}>
            <rect x={1150} y={430} width={440} height={260} rx={18} fill="#0b1226" stroke={C.cyan} strokeWidth={3} />
            <rect x={1340} y={690} width={60} height={40} fill="#2a3352" />
            <rect x={1270} y={728} width={200} height={14} rx={7} fill="#2a3352" />
            {/* garis kode yang bergulir di layar */}
            {Array.from({length: 6}, (_, k) => {
              const yy = 462 + ((k * 26 + t * 40) % 156);
              return <rect key={k} x={1180} y={yy} width={120 + ((k * 73) % 220)} height={10} rx={5} fill={C.cyan} opacity={0.35} />;
            })}
            <text x={1370} y={680} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.gold}>
              Ĥψ ≈ Eψ
            </text>
            {Array.from({length: 6}, (_, k) => {
              const p = ruleIn(k);
              const x0 = 1110 + k * 96;
              const x = mix(x0, 1370, p);
              const y = mix(370, 560, p);
              return (
                <g key={k} opacity={1 - 0.85 * ramp(p, 0.75, 1)} transform={`translate(${x} ${y}) scale(${1 - 0.5 * p})`}>
                  <circle r={30} fill="rgba(30,24,8,0.85)" stroke={C.gold} strokeWidth={2} />
                  <text y={2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={28} fontWeight={600} fill={C.gold}>
                    {k + 1}
                  </text>
                </g>
              );
            })}
            <Label x={1370} y={800} size={26} color={C.muted}>
              enam aturan main → solusi pendekatan
            </Label>
          </g>
        </g>
        {/* fungsi basis → orbital */}
        <g opacity={basis * partOut}>
          <line x1={BP.x} y1={BP.y} x2={BP.x + BP.w} y2={BP.y} stroke={C.faint} strokeWidth={2} />
          {bas.map((b, i) => (
            <path
              key={i}
              d={Array.from({length: 121}, (_, k) => `${k ? 'L' : 'M'}${(BP.x + (k / 120) * BP.w).toFixed(1)},${(BP.y - b.a * g(k / 120, b.c, b.w) * BP.sy).toFixed(1)}`).join(' ')}
              fill="none"
              stroke={b.col}
              strokeWidth={3}
              strokeDasharray="7 6"
              opacity={1 - 0.5 * sumP}
            />
          ))}
          <path
            d={Array.from({length: 161}, (_, k) => `${k ? 'L' : 'M'}${(BP.x + (k / 160) * BP.w).toFixed(1)},${(BP.y - orb(k / 160) * BP.sy * sumP).toFixed(1)}`).join(' ')}
            fill="none"
            stroke={C.mint}
            strokeWidth={6}
            opacity={sumP}
          />
          <Label x={BP.x + BP.w / 2} y={BP.y - 130} size={26} color={C.ink}>
            {sumP > 0.5 ? 'orbital = Σ c · (fungsi basis)' : 'fungsi basis Gauss'}
          </Label>
        </g>
        {/* iterasi energi */}
        <g opacity={iter > 0 ? partOut : 0}>
          <line x1={EP.x} y1={EP.y} x2={EP.x + EP.w + 20} y2={EP.y} stroke={C.muted} strokeWidth={2} />
          <line x1={EP.x} y1={EP.y} x2={EP.x} y2={EP.y - EP.h - 10} stroke={C.muted} strokeWidth={2} />
          <Label x={EP.x + EP.w} y={EP.y + 28} size={22} color={C.muted} anchor="end">
            iterasi
          </Label>
          <Label x={EP.x - 14} y={EP.y - EP.h} size={22} color={C.muted} anchor="end">
            E
          </Label>
          {Array.from({length: Math.min(N_IT, shown)}, (_, k) => (
            <g key={k}>
              {k > 0 ? <line x1={epx(k - 1)} y1={epy(E(k - 1))} x2={epx(k)} y2={epy(E(k))} stroke={C.gold} strokeWidth={3} /> : null}
              <circle cx={epx(k)} cy={epy(E(k))} r={8} fill={C.gold} />
            </g>
          ))}
          <Label x={EP.x + EP.w - 10} y={epy(E(N_IT - 1)) - 30} size={24} color={C.gold} anchor="end" opacity={shown >= N_IT ? 1 : 0}>
            energi minimum: konvergen
          </Label>
        </g>
        {/* baris 5: corong penyaringan kandidat molekul */}
        <g opacity={funnel}>
          <path
            d={`M${FN.cx - FN.half},${FN.top} L${FN.cx + FN.half},${FN.top} L${FN.cx + FN.neckHalf},${FN.neck} L${FN.cx + FN.neckHalf},${FN.bottom} L${FN.cx - FN.neckHalf},${FN.bottom} L${FN.cx - FN.neckHalf},${FN.neck} Z`}
            fill="rgba(79,214,255,0.06)"
            stroke={C.cyan}
            strokeWidth={3}
          />
          {/* pita perhitungan kuantum */}
          <rect x={FN.cx - halfW(BAND_Y)} y={BAND_Y - 16} width={2 * halfW(BAND_Y)} height={32} fill={C.violet} opacity={0.18 + 0.08 * Math.sin(t * 5)} />
          <line x1={FN.cx - halfW(BAND_Y)} y1={BAND_Y} x2={FN.cx + halfW(BAND_Y)} y2={BAND_Y} stroke={C.violet} strokeWidth={2} strokeDasharray="10 8" />
          <Label x={FN.cx + halfW(BAND_Y) + 26} y={BAND_Y} size={26} color={C.violet} weight={700} anchor="start">
            perhitungan kuantum
          </Label>
          <Label x={FN.cx} y={FN.top - 56} size={26} color={C.muted}>
            ribuan kandidat molekul
          </Label>
          {Array.from({length: N_CAND}, (_, k) => {
            const p = (t - flow0 - k * 0.26) / FLY;
            if (p <= 0 || p >= 1) return null;
            const x0 = FN.cx + (rand(k * 3.71 + 0.3) - 0.5) * 2 * (FN.half - 40);
            const y0 = FN.top - 22;
            const ok = passes(k);
            if (p < 0.45) {
              // turun menuju pita perhitungan, mengikuti dinding corong
              const q = p / 0.45;
              const y = mix(y0, BAND_Y, q);
              const x = FN.cx + (x0 - FN.cx) * ((halfW(y) - 24) / (FN.half - 24));
              return <Hexa key={k} x={x} y={y} color={C.muted} opacity={Math.min(1, q * 4)} spin={k * 20 + p * 90} />;
            }
            const xb = FN.cx + (x0 - FN.cx) * ((halfW(BAND_Y) - 24) / (FN.half - 24));
            if (p < 0.55) return <Hexa key={k} x={xb} y={BAND_Y} color={ok ? C.mint : C.red} spin={k * 20 + 40} />;
            const q = (p - 0.55) / 0.45;
            if (ok) {
              // lolos: lewat leher corong menuju labu laboratorium
              const y = mix(BAND_Y, 790, q);
              const x = mix(xb, FN.cx, Math.min(1, q * 1.6));
              return <Hexa key={k} x={x} y={y} color={C.mint} opacity={1 - ramp(q, 0.85, 1)} spin={k * 20 + 40 + q * 120} />;
            }
            // gagal: terlempar keluar dari corong dan memudar
            const side = x0 >= FN.cx ? 1 : -1;
            return <Hexa key={k} x={xb + side * 360 * q} y={BAND_Y - 70 * Math.sin(Math.PI * q * 0.8) + 40 * q} color={C.red} opacity={1 - q} spin={k * 20 + side * q * 200} />;
          })}
          <g opacity={lab}>
            <FlaskIcon x={FN.cx} y={780} fill={Math.min(1, arrived / 5)} />
            <Label x={FN.cx + 80} y={790} size={26} color={C.mint} weight={700} anchor="start">
              {`sedikit yang layak → disintesis di lab`}
            </Label>
          </g>
        </g>
        {/* ikon industri */}
        <g opacity={funnel}>
          {[
            {label: 'farmasi (obat)', x: 330, y: 420, col: C.red, Icon: PillIcon},
            {label: 'katalis', x: 330, y: 660, col: C.mint, Icon: CatalystIcon},
            {label: 'baterai', x: 1600, y: 420, col: C.amber, Icon: BatteryIcon},
          ].map((c, i) => (
            <g key={c.label} opacity={iconP[i]} transform={`translate(${c.x} ${c.y}) scale(${0.7 + 0.3 * iconP[i]}) translate(${-c.x} ${-c.y})`}>
              <circle cx={c.x} cy={c.y - 10} r={96} fill={c.col} opacity={0.07} />
              <c.Icon x={c.x} y={c.y - 10} t={t} />
              <Label x={c.x} y={c.y + 100} size={30} color={c.col} weight={700}>
                {c.label}
              </Label>
            </g>
          ))}
        </g>
      </Stage>
      <Badge x={960} y={250} text="NOBEL KIMIA 1998 · W. KOHN & J. POPLE" color={C.gold} opacity={slot(t, cue(4) - 0.1, cue(5) - 0.05, 0.5) * ramp(t, cue(4) - 0.1, cue(4) + 0.5, BACK)} />
      <Badge x={960} y={250} text="DFT: BEKERJA DENGAN RAPAT ELEKTRON ρ(r)" color={C.cyan} opacity={slot(t, cue(3) + 0.2, cue(4) - 0.1, 0.5)} />
    </AbsoluteFill>
  );
};
