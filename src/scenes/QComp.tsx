import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, rand, ramp, win} from '../anim';
import {Atom, Badge, Bond, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 17: komputer kuantum. Bit vs qubit (bola Bloch), pembacaan = pengukuran (peluang c²),
// qubit superkonduktor dengan tingkat energi terkuantisasi, dan tujuan: simulasi molekul.
const BL = {x: 1250, y: 540, r: 190};

export const QComp: React.FC = () => {
  const {t, cue} = useScene();
  const bit = win(t, cue(0) + 0.3, cue(3) - 0.1, 0.6, 0.5);
  const bloch = ramp(t, cue(1) + 1.0, cue(1) + 2.0) * (1 - ramp(t, cue(3) - 0.4, cue(3)));
  const meas = ramp(t, cue(2) + 0.6, cue(2) + 1.2, EASE_IN_OUT);
  const chip = ramp(t, cue(3) + 0.1, cue(3) + 1.1) * (1 - ramp(t, cue(5) - 0.4, cue(5)));
  const mol = ramp(t, cue(5) + 0.2, cue(5) + 1.2);
  // keadaan qubit: θ tetap (peluang |0⟩ = cos²(θ/2) = 0,7), φ berputar
  const th = 2 * Math.acos(Math.sqrt(0.7));
  const ph = t * 1.3;
  const result0 = rand(Math.floor((t - cue(2)) / 1.6) + 3.3) < 0.7;
  const th2 = meas > 0 ? mix(th, result0 ? 0 : Math.PI, meas) : th;
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
        {/* tujuan: kimia */}
        <g opacity={mol}>
          {(() => {
            const pts: [number, number][] = Array.from({length: 6}, (_, k) => [1200 + 120 * Math.cos((k * Math.PI) / 3 + t * 0.3), 540 + 120 * Math.sin((k * Math.PI) / 3 + t * 0.3)]);
            return (
              <g>
                <circle cx={1200} cy={540} r={250} fill="url(#soft-violet)" opacity={0.35} />
                {pts.map((p, k) => {
                  const q = pts[(k + 1) % 6];
                  return <Bond key={k} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} order={k % 2 ? 1 : 2} width={10} />;
                })}
                {pts.map((p, k) => (
                  <Atom key={k} x={p[0]} y={p[1]} el={k === 0 ? 'Fe' : k === 3 ? 'N' : 'C'} r={28} glow={0} label={k === 0 ? 'Fe' : undefined} />
                ))}
              </g>
            );
          })()}
          <rect x={300} y={430} width={340} height={220} rx={18} fill="#13203f" stroke={C.cyan} strokeWidth={3} />
          <text x={470} y={550} textAnchor="middle" fontFamily={FONT.sans} fontSize={34} fill={C.cyan} fontWeight={700}>
            qubit
          </text>
          <line x1={660} y1={540} x2={900} y2={540} stroke={C.gold} strokeWidth={5} markerEnd="url(#arrow-gold)" />
          <Label x={780} y={500} size={26} color={C.gold}>
            simulasi
          </Label>
          <Label x={1200} y={840} size={26} color={C.muted}>
            molekul yang terlalu rumit bagi komputer biasa (ilustrasi)
          </Label>
        </g>
      </Stage>
      <Badge x={960} y={250} text="NOBEL FISIKA 2025 · CLARKE, DEVORET & MARTINIS" color={C.gold} opacity={win(t, cue(4) - 0.1, cue(5) - 0.1, 0.5, 0.4) * ramp(t, cue(4) - 0.1, cue(4) + 0.6, BACK)} />
      <Badge x={960} y={250} text="ATURAN PENGUKURAN = CARA MEMBACA QUBIT" color={C.cyan} opacity={win(t, cue(2), cue(3) - 0.1, 0.5, 0.4)} />
    </AbsoluteFill>
  );
};
