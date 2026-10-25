import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, win} from '../anim';
import {Card, Formula, Frac, Hbar, Label, Op, Stage, Sub, Sup, V} from '../components/primitives';
import {FnPanel, Machine} from '../components/machine';
import {PhaseWave} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 5: fungsi eigen. Demo umum (sin di kotak → d²/dx² → bentuk sama × konstanta),
// lalu tiga baris: e^{ikx} ke p̂ (eigen), T̂ (eigen), x̂ (bukan eigen).
const ROWS = [340, 530, 720];
const helix = (t: number, grow?: (u: number) => number) => (u: number) => {
  const ph = 7 * Math.PI * u - 2 * t;
  const a = 0.62 * (grow ? grow(u) : 1);
  return [a * Math.cos(ph), a * Math.sin(ph)] as [number, number];
};

export const Eigen: React.FC = () => {
  const {t, cue} = useScene();
  const demo = ramp(t, cue(1) - 0.3, cue(1) + 0.6) * (1 - ramp(t, cue(3) - 0.4, cue(3) + 0.2));
  const demoOut = ramp(t, cue(1) + 1.6, cue(1) + 2.8, EASE_IN_OUT);
  const tag = ramp(t, cue(2), cue(2) + 0.7, BACK);
  const rowsOff = 1 - ramp(t, cue(7) - 0.4, cue(7) + 0.3);
  const rows = [
    {op: <Op>p</Op>, res: <span><Hbar />k</span>, ok: true, col: C.violet, a: cue(3)},
    {op: <Op>T</Op>, res: <span><Frac n={<><Hbar /><Sup>2</Sup><V>k</V><Sup>2</Sup></>} d={<>2<V>m</V></>} size={0.6} /></span>, ok: true, col: C.gold, a: cue(4)},
    {op: <Op>x</Op>, res: <span>× <V>x</V> ?</span>, ok: false, col: C.red, a: cue(5)},
  ];
  return (
    <AbsoluteFill>
      <Stage>
        {/* demo umum: bentuk tetap */}
        <g opacity={demo}>
          <FnPanel x={150} y={560} w={440} f={(u) => Math.sin(3 * Math.PI * u)} sy={110} color={C.ink} label="sin(3πx/L)" />
          <Machine x={960} y={560} label={<span>d<Sup>2</Sup>/dx<Sup>2</Sup></span>} t={t} active={Math.sin(Math.PI * ramp(t, cue(1) + 0.4, cue(1) + 2.2))} color={C.mint} />
          <FnPanel x={1330} y={560} w={440} f={(u) => -1.35 * Math.sin(3 * Math.PI * u)} sy={110 * demoOut} color={C.mint} label="bentuk sama, terbalik & diperbesar" opacity={demoOut} />
          <g opacity={tag}>
            <rect x={1400} y={350} width={300} height={70} rx={16} fill="rgba(12,18,40,0.9)" stroke={C.gold} strokeWidth={2.5} />
            <text x={1550} y={386} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.gold}>
              × (−9π²/L²)
            </text>
            <Label x={1550} y={318} size={24} color={C.gold}>
              nilai eigen
            </Label>
          </g>
        </g>
        {/* tiga baris operator */}
        {rows.map((r, i) => {
          const p = ramp(t, r.a - 0.3, r.a + 0.6) * rowsOff;
          const go = ramp(t, r.a + 0.6, r.a + 2.0, EASE_IN_OUT);
          const verdict = ramp(t, r.a + 1.8, r.a + 2.6, BACK);
          const y = ROWS[i];
          return (
            <g key={i} opacity={p}>
              <PhaseWave f={helix(t)} x={140} y={y + 40} w={400} sy={65} n={90} outline={false} mirror />
              <Label x={340} y={y - 62} size={28} color={C.muted} font="serif" italic>
                e<tspan baselineShift="super" fontSize={19}>ikx</tspan>
              </Label>
              <Machine x={780} y={y} w={210} h={130} label={r.op} t={t} active={Math.sin(Math.PI * go)} color={r.col} />
              <g opacity={go}>
                <PhaseWave f={helix(t, r.ok ? undefined : (u) => 0.25 + 1.3 * u)} x={1000} y={y + 40} w={400} sy={65} n={90} outline={false} mirror />
              </g>
              <g opacity={verdict}>
                <rect x={1450} y={y - 44} width={330} height={88} rx={16} fill="rgba(12,18,40,0.9)" stroke={r.col} strokeWidth={2.5} />
                <foreignObject x={1450} y={y - 44} width={330} height={88}>
                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: FONT.serif, fontSize: 36, color: r.ok ? C.mint : C.red, whiteSpace: 'nowrap'}}>
                    <span>{r.ok ? '✓' : '✗'}</span>
                    <span style={{color: C.ink}}>{r.ok ? <>× {r.res}</> : 'bukan eigen'}</span>
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}
      </Stage>
      <Formula x={960} y={260} p={win(t, cue(0) + 0.3, cue(3) - 0.2, 0.7, 0.4)} accent={C.gold} caption="persamaan eigen: a konstanta = nilai eigen = hasil ukur yang mungkin">
        <Op>A</Op>&thinsp;<V>φ</V>
        <Sub>n</Sub>&nbsp;=&nbsp;<V>a</V>
        <Sub>n</Sub>&thinsp;<V>φ</V>
        <Sub>n</Sub>
      </Formula>
      <Card x={960} y={470} opacity={ramp(t, cue(7) + 0.2, cue(7) + 1.0)} accent={C.gold} style={{padding: '26px 44px'}}>
        <div style={{fontFamily: FONT.sans, fontSize: 26, color: C.muted, textAlign: 'center', marginBottom: 12}}>Contoh modul · elektron, k = 1,00 × 10¹⁰ m⁻¹</div>
        <div style={{fontFamily: FONT.serif, fontSize: 56, lineHeight: 1.45, textAlign: 'center', whiteSpace: 'nowrap'}}>
          <V>p</V>&nbsp;=&nbsp;
          <Hbar />
          <V>k</V>&nbsp;=&nbsp;1,05 × 10<Sup>−24</Sup>&nbsp;kg m s<Sup>−1</Sup>
          <br />
          <V>E</V>&nbsp;=&nbsp;
          <Frac n={<><Hbar /><Sup>2</Sup><V>k</V><Sup>2</Sup></>} d={<>2<V>m</V><Sub>e</Sub></>} />
          &nbsp;=&nbsp;6,10 × 10<Sup>−19</Sup>&nbsp;J&nbsp;≈&nbsp;
          <span style={{color: C.gold}}>3,81 eV</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
