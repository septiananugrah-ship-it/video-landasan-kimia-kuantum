import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, slot, win} from '../anim';
import {Badge, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 17: komputer kuantum. Bit vs qubit (bola Bloch), pembacaan = pengukuran (peluang c²),
// qubit superkonduktor dengan tingkat energi terkuantisasi, dan tujuan: simulasi molekul.
const BL = {x: 1250, y: 565, r: 190};
// klaster kubana Fe₄S₄: Fe dan S berselang-seling di sudut kubus, tiap Fe terikat ke tiga S
const CUBE = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => ({x, y, z, fe: (x * y * z) > 0}))));

export const QComp: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const bit = win(t, cue(0) + 0.3, cue(3) - 0.1, 0.6, 0.5);
  // bola Bloch sudah tampil di baris 0 (panah di |0⟩, seperti bit), lalu miring ke superposisi saat "Qubit"
  const bloch = ramp(t, cue(0) + 0.8, cue(0) + 1.8) * (1 - ramp(t, cue(3) - 0.4, cue(3)));
  const tiltIn = ramp(t, wordOf(1, 'Qubit') - 0.2, wordOf(1, 'Qubit') + 1.2, EASE_IN_OUT);
  const meas = ramp(t, cue(2) + 0.6, cue(2) + 1.2, EASE_IN_OUT);
  const chip = ramp(t, cue(3) + 0.1, cue(3) + 1.1) * (1 - ramp(t, cue(5) - 0.4, cue(5)));
  const mol = ramp(t, cue(5) + 0.2, cue(5) + 1.2);
  // keadaan qubit: θ tetap (peluang |0⟩ = cos²(θ/2) = 0,7), φ berputar
  const th = 2 * Math.acos(Math.sqrt(0.7));
  const ph = t * 1.3;
  // pembacaan berulang: siapkan superposisi → baca (runtuh ke |0⟩ atau |1⟩) → siapkan lagi, tanpa lompatan
  const cyc = Math.max(0, t - cue(2) - 0.6) / 1.8;
  const cf = cyc % 1;
  const result0 = rand(Math.floor(cyc) * 2.71 + 0.4) < 0.7;
  const fall = meas > 0 ? (cf < 0.3 ? ramp(cf, 0, 0.3, EASE_IN_OUT) : cf < 0.7 ? 1 : 1 - ramp(cf, 0.7, 1, EASE_IN_OUT)) : 0;
  const th2 = mix(th * tiltIn, result0 ? 0 : Math.PI, fall);
  // proyeksi sederhana bola Bloch (sumbu z ke atas, sedikit miring)
  const P = (thv: number, phv: number) => ({
    x: BL.x + BL.r * Math.sin(thv) * Math.cos(phv),
    y: BL.y - BL.r * Math.cos(thv) + BL.r * 0.28 * Math.sin(thv) * Math.sin(phv),
  });
  const tip = P(th2, ph);
  const shots = Math.floor(Math.max(0, t - cue(2) - 1.4) / 0.25);
  let n0 = 0;
  for (let k = 0; k < shots; k++) if (rand(k * 2.71 + 0.4) < 0.7) n0++;
  const n1 = shots - n0;
  // tingkat energi qubit transmon: jarak makin rapat (anharmonik)
  const lv = [0, 1, 1.94, 2.82];
  return (
    <AbsoluteFill>
      <Stage>
        {/* bit klasik */}
        <g opacity={bit}>
          <rect x={300} y={400} width={260} height={280} rx={26} fill="rgba(12,18,40,0.85)" stroke={C.muted} strokeWidth={2} />
          <text x={430} y={560} textAnchor="middle" fontFamily={FONT.mono} fontSize={140} fontWeight={600} fill={C.ink}>
            {Math.sin(t * 2) > 0 ? '0' : '1'}
          </text>
          <Label x={430} y={720} size={28} color={C.muted}>
            bit: 0 atau 1
          </Label>
        </g>
        {/* bola Bloch */}
        <g opacity={bloch}>
          <circle cx={BL.x} cy={BL.y} r={BL.r} fill="rgba(160,131,255,0.07)" stroke={C.violet} strokeWidth={2} />
          <ellipse cx={BL.x} cy={BL.y} rx={BL.r} ry={BL.r * 0.28} fill="none" stroke={C.violet} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.6} />
          <line x1={BL.x} y1={BL.y - BL.r - 30} x2={BL.x} y2={BL.y + BL.r + 30} stroke={C.faint} strokeWidth={2} />
          <Label x={BL.x} y={BL.y - BL.r - 54} size={32} color={C.cyan} font="serif" italic>
            |0⟩
          </Label>
          <Label x={BL.x} y={BL.y + BL.r + 56} size={32} color={C.amber} font="serif" italic>
            |1⟩
          </Label>
          <line x1={BL.x} y1={BL.y} x2={tip.x} y2={tip.y} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
          <circle cx={tip.x} cy={tip.y} r={12} fill={C.gold} filter="url(#glow)" />
          <Label x={BL.x + BL.r + 40} y={BL.y - 40} size={26} color={C.ink} anchor="start" opacity={1 - meas}>
            qubit: c₀|0⟩ + c₁|1⟩
          </Label>
          <g opacity={meas}>
            <Label x={BL.x + BL.r + 40} y={BL.y + 20} size={26} color={C.gold} anchor="start" weight={700}>
              dibaca → runtuh
            </Label>
            {[
              {n: n0, col: C.cyan, lbl: '0'},
              {n: n1, col: C.amber, lbl: '1'},
            ].map((b, i) => (
              <g key={i}>
                <rect x={1520 + i * 110} y={760 - b.n * 3.2} width={80} height={b.n * 3.2} rx={6} fill={b.col} opacity={0.85} />
                <Label x={1560 + i * 110} y={790} size={24} color={b.col} font="mono">
                  {b.lbl}
                </Label>
              </g>
            ))}
            <Label x={1615} y={500} size={22} color={C.muted}>
              {`${shots} pembacaan`}
            </Label>
          </g>
        </g>
        {/* chip superkonduktor */}
        <g opacity={chip}>
          <rect x={280} y={360} width={520} height={400} rx={18} fill="#13203f" stroke={C.cyan} strokeWidth={3} />
          {Array.from({length: 6}, (_, k) => (
            <rect key={k} x={260} y={390 + k * 62} width={20} height={30} fill={C.gold} opacity={0.7} />
          ))}
          <path d="M380,560 C380,460 480,460 480,560 C480,660 580,660 580,560 C580,460 680,460 680,560" fill="none" stroke={C.cyan} strokeWidth={8} opacity={0.8} />
          <rect x={520} y={598} width={30} height={30} fill="none" stroke={C.red} strokeWidth={4} />
          <line x1={520} y1={598} x2={550} y2={628} stroke={C.red} strokeWidth={4} />
          <line x1={550} y1={598} x2={520} y2={628} stroke={C.red} strokeWidth={4} />
          <Label x={540} y={720} size={24} color={C.muted}>
            rangkaian superkonduktor (skematis)
          </Label>
          {lv.map((e, k) => {
            const y = 760 - e * 120;
            return (
              <g key={k} opacity={ramp(t, cue(3) + 0.8 + k * 0.3, cue(3) + 1.3 + k * 0.3)}>
                <line x1={1100} y1={y} x2={1420} y2={y} stroke={k < 2 ? C.gold : C.faint} strokeWidth={k < 2 ? 6 : 3} />
                <Label x={1450} y={y} size={28} color={k < 2 ? C.gold : C.muted} anchor="start" font="serif" italic>
                  {k < 2 ? `|${k}⟩` : `|${k}⟩`}
                </Label>
              </g>
            );
          })}
          <Label x={1260} y={360} size={28} color={C.ink}>
            tingkat energi terkuantisasi
          </Label>
          <Label x={1260} y={810} size={22} color={C.muted}>
            dua tingkat terbawah = qubit
          </Label>
        </g>
        {/* tujuan: kimia — prosesor qubit mensimulasikan klaster Fe₄S₄ (ilustrasi) */}
        <g opacity={mol}>
          {(() => {
            const a = t * 0.45;
            const b = 0.42;
            const size = 115;
            const cx = 1280;
            const cy = 530;
            const P3 = (v: {x: number; y: number; z: number}) => {
              const x1 = v.x * Math.cos(a) - v.z * Math.sin(a);
              const z1 = v.x * Math.sin(a) + v.z * Math.cos(a);
              const y2 = v.y * Math.cos(b) - z1 * Math.sin(b);
              const d = v.y * Math.sin(b) + z1 * Math.cos(b);
              return {X: cx + size * x1, Y: cy - size * y2, d};
            };
            const pts = CUBE.map((v) => ({...v, ...P3(v)}));
            const edges: [number, number][] = [];
            for (let i = 0; i < 8; i++)
              for (let j = i + 1; j < 8; j++)
                if (Math.abs(CUBE[i].x - CUBE[j].x) + Math.abs(CUBE[i].y - CUBE[j].y) + Math.abs(CUBE[i].z - CUBE[j].z) === 2) edges.push([i, j]);
            const order = pts.map((_, i) => i).sort((i, j) => pts[i].d - pts[j].d);
            return (
              <g>
                <circle cx={cx} cy={cy} r={260} fill="url(#soft-violet)" opacity={0.3} />
                {edges.map(([i, j], k) => (
                  <line key={k} x1={pts[i].X} y1={pts[i].Y} x2={pts[j].X} y2={pts[j].Y} stroke="#8b97b8" strokeWidth={8} strokeLinecap="round" opacity={0.55 + 0.25 * ((pts[i].d + pts[j].d) / 2 + 1) / 2} />
                ))}
                {order.map((i) => {
                  const q = pts[i];
                  const r = q.fe ? 32 : 27;
                  return (
                    <g key={i}>
                      <circle cx={q.X} cy={q.Y} r={r} fill={q.fe ? '#d9773a' : '#f2d14a'} stroke="#0b0f1c" strokeWidth={3} />
                      <circle cx={q.X - r * 0.3} cy={q.Y - r * 0.35} r={r * 0.3} fill="#fff" opacity={0.35} />
                      <text x={q.X} y={q.Y + 1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={22} fill="#1d2440">
                        {q.fe ? 'Fe' : 'S'}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
          {/* prosesor qubit: 3 × 3 qubit, masing-masing dalam superposisi */}
          <rect x={290} y={400} width={330} height={290} rx={18} fill="#13203f" stroke={C.cyan} strokeWidth={3} />
          {Array.from({length: 9}, (_, k) => {
            const qx = 360 + (k % 3) * 95;
            const qy = 470 + Math.floor(k / 3) * 80;
            const aa = t * (1.2 + 0.15 * k) + k;
            return (
              <g key={k}>
                <circle cx={qx} cy={qy} r={24} fill="none" stroke={C.violet} strokeWidth={2} opacity={0.7} />
                <line x1={qx} y1={qy} x2={qx + 20 * Math.sin(aa)} y2={qy - 20 * Math.cos(aa)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
                {k % 3 < 2 ? <line x1={qx + 26} y1={qy} x2={qx + 69} y2={qy} stroke={C.cyan} strokeWidth={2} opacity={0.4} /> : null}
              </g>
            );
          })}
          <Label x={455} y={730} size={26} color={C.cyan} weight={700}>
            prosesor qubit
          </Label>
          <line x1={650} y1={545} x2={940} y2={545} stroke={C.gold} strokeWidth={5} markerEnd="url(#arrow-gold)" />
          <Label x={795} y={505} size={26} color={C.gold}>
            simulasi
          </Label>
          <Label x={1280} y={800} size={26} color={C.muted}>
            contoh target: klaster besi–belerang Fe₄S₄ pada enzim (ilustrasi)
          </Label>
        </g>
      </Stage>
      <Badge x={960} y={250} text="NOBEL FISIKA 2025 · CLARKE, DEVORET & MARTINIS" color={C.gold} opacity={win(t, cue(4) - 0.1, cue(5) - 0.1, 0.5, 0.4) * ramp(t, cue(4) - 0.1, cue(4) + 0.6, BACK)} />
      <Badge x={960} y={250} text="ATURAN PENGUKURAN = CARA MEMBACA QUBIT" color={C.cyan} opacity={slot(t, cue(2), cue(3) - 0.05, 0.5)} />
    </AbsoluteFill>
  );
};
