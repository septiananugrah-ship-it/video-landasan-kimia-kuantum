import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, win} from '../anim';
import {Badge, Card, Formula, Frac, Label, Stage, Sqrt, Sub, V} from '../components/primitives';
import {Electron} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 11: partikel identik, spin (Stern–Gerlach 1922), antisimetri fermion & larangan Pauli.
export const SpinArrow: React.FC<{x: number; y: number; up: boolean; len?: number; color?: string; opacity?: number}> = ({x, y, up, len = 70, color = C.gold, opacity = 1}) => (
  <line x1={x} y1={y + (up ? len / 2 : -len / 2)} x2={x} y2={y + (up ? -len / 2 : len / 2)} stroke={color} strokeWidth={6} strokeLinecap="round" markerEnd="url(#arrow-gold)" opacity={opacity} />
);

const Particle: React.FC<{x: number; y: number; kind: 'e' | 'b'; label?: string; opacity?: number}> = ({x, y, kind, label, opacity = 1}) => (
  <g opacity={opacity}>
    {kind === 'e' ? <Electron x={x} y={y} r={26} label /> : (
      <g>
        <circle cx={x} cy={y} r={60} fill="url(#soft-gold)" opacity={0.6} />
        <circle cx={x} cy={y} r={26} fill={C.amber} />
      </g>
    )}
    {label ? (
      <text x={x} y={y - 52} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fill={C.muted}>
        {label}
      </text>
    ) : null}
  </g>
);

export const Pauli: React.FC = () => {
  const {t, cue} = useScene();
  const ident = win(t, cue(0) + 0.2, cue(1) - 0.1, 0.6, 0.4);
  const spin = win(t, cue(1), cue(2) - 0.1, 0.6, 0.4);
  const flip = Math.sin((t - cue(1)) * 2.4) > 0;
  const sg = win(t, cue(2) - 0.1, cue(3) - 0.1, 0.7, 0.5);
  const beam = ramp(t, cue(2) + 1.2, cue(2) + 3.2, EASE_IN_OUT);
  const spots = ramp(t, cue(2) + 3.0, cue(2) + 4.0);
  const ex = win(t, cue(3), cue(5) - 0.1, 0.6, 0.4);
  const swapF = ramp(t, cue(3) + 1.0, cue(3) + 2.6, EASE_IN_OUT);
  const swapB = ramp(t, cue(4) + 0.6, cue(4) + 2.2, EASE_IN_OUT);
  const boson = ramp(t, cue(4) - 0.2, cue(4) + 0.6);
  const slater = ramp(t, cue(5) - 0.2, cue(5) + 0.6);
  const same = ramp(t, cue(5) + 1.2, cue(5) + 2.2);
  const strike = ramp(t, cue(6) + 0.6, cue(6) + 1.6);
  const zero = ramp(t, cue(6) + 1.6, cue(6) + 2.4, BACK);
  const boxes = ramp(t, cue(7) + 0.4, cue(7) + 1.2, BACK);
  const arc = (p: number, xa: number, xb: number, y: number, up: number) => ({x: mix(xa, xb, p), y: y - up * Math.sin(Math.PI * p) * 90});
  // Stern–Gerlach
  const OV = {x: 220, y: 560};
  const MG = {x: 820, y: 560};
  const SCR = {x: 1500, y: 560};
  const split = 150;
  return (
    <AbsoluteFill>
      <Stage>
        {/* identik */}
        <g opacity={ident}>
          <Particle x={760} y={560} kind="e" label="1 ?" />
          <Particle x={1160} y={560} kind="e" label="2 ?" />
          <Label x={960} y={680} size={30} color={C.muted}>
            identik: tidak ada label, tidak ada tanda pengenal
          </Label>
        </g>
        {/* spin */}
        <g opacity={spin}>
          <Electron x={960} y={560} r={34} />
          <SpinArrow x={960} y={560} up={flip} len={150} />
          <Label x={1160} y={500} size={32} color={C.gold} anchor="start" weight={700}>
            {flip ? 'spin atas ↑' : 'spin bawah ↓'}
          </Label>
          <Label x={1160} y={560} size={26} color={C.muted} anchor="start">
            hanya dua kemungkinan
          </Label>
        </g>
        {/* Stern–Gerlach */}
        <g opacity={sg}>
          <rect x={OV.x - 90} y={OV.y - 60} width={120} height={120} rx={14} fill="#3a2414" stroke={C.amber} strokeWidth={3} />
          <Label x={OV.x - 30} y={OV.y + 90} size={22} color={C.muted}>
            tungku atom Ag
          </Label>
          {/* kutub magnet */}
          <path d={`M${MG.x - 150},${MG.y - 170} L${MG.x + 150},${MG.y - 170} L${MG.x + 150},${MG.y - 70} L${MG.x},${MG.y - 30} L${MG.x - 150},${MG.y - 70} Z`} fill="#5a2230" stroke={C.red} strokeWidth={3} />
          <path d={`M${MG.x - 150},${MG.y + 170} L${MG.x + 150},${MG.y + 170} L${MG.x + 150},${MG.y + 60} L${MG.x - 150},${MG.y + 60} Z`} fill="#1f2e5a" stroke={C.blue} strokeWidth={3} />
          <Label x={MG.x} y={MG.y - 130} size={30} color={C.ink} weight={700}>
            N
          </Label>
          <Label x={MG.x} y={MG.y + 130} size={30} color={C.ink} weight={700}>
            S
          </Label>
          {/* berkas */}
          <line x1={OV.x + 30} y1={OV.y} x2={mix(OV.x + 30, MG.x - 150, Math.min(1, beam * 2))} y2={OV.y} stroke={C.cyan} strokeWidth={6} opacity={0.8} />
          {beam > 0.5
            ? [-1, 1].map((s) => {
                const p = (beam - 0.5) * 2;
                const x2 = mix(MG.x - 150, SCR.x, p);
                const y2 = MG.y + s * split * Math.pow(p, 1.6);
                return <path key={s} d={`M${MG.x - 150},${MG.y} Q${MG.x + 150},${MG.y} ${x2},${y2}`} fill="none" stroke={C.cyan} strokeWidth={6} opacity={0.8} />;
              })
            : null}
          {/* layar */}
          <rect x={SCR.x} y={SCR.y - 250} width={30} height={500} fill="rgba(12,18,40,0.9)" stroke={C.faint} strokeWidth={2} />
          <rect x={SCR.x + 34} y={SCR.y - 180} width={12} height={360} fill={C.muted} opacity={0.18} />
          <Label x={SCR.x + 120} y={SCR.y} size={22} color={C.muted} anchor="start">
            dugaan klasik:
          </Label>
          <Label x={SCR.x + 120} y={SCR.y + 30} size={22} color={C.muted} anchor="start">
            garis tersebar
          </Label>
          {[-1, 1].map((s) => (
            <g key={s} opacity={spots}>
              <ellipse cx={SCR.x + 15} cy={SCR.y + s * split} rx={20} ry={34} fill={C.cyan} filter="url(#glow)" />
              <Label x={SCR.x + 120} y={SCR.y + s * split} size={28} color={C.gold} anchor="start" weight={700}>
                {s < 0 ? '↑' : '↓'}
              </Label>
            </g>
          ))}
        </g>
        {/* pertukaran: fermion vs boson */}
        <g opacity={ex}>
          <Label x={520} y={380} size={32} color={C.cyan} weight={700}>
            fermion (elektron)
          </Label>
          {(() => {
            const a = arc(swapF, 380, 660, 560, 1);
            const b = arc(swapF, 660, 380, 560, -1);
            return (
              <g>
                <Particle x={a.x} y={a.y} kind="e" />
                <Particle x={b.x} y={b.y} kind="e" />
              </g>
            );
          })()}
          <Label x={520} y={720} size={48} color={swapF > 0.5 ? C.red : C.ink} font="serif" italic weight={600}>
            {swapF > 0.5 ? '−Ψ' : '+Ψ'}
          </Label>
          <g opacity={boson}>
            <Label x={1400} y={380} size={32} color={C.amber} weight={700}>
              boson (foton, ⁴He)
            </Label>
            {(() => {
              const a = arc(swapB, 1260, 1540, 560, 1);
              const b = arc(swapB, 1540, 1260, 560, -1);
              return (
                <g>
                  <Particle x={a.x} y={a.y} kind="b" />
                  <Particle x={b.x} y={b.y} kind="b" />
                </g>
              );
            })()}
            <Label x={1400} y={720} size={48} color={C.mint} font="serif" italic weight={600}>
              +Ψ
            </Label>
          </g>
          <line x1={960} y1={400} x2={960} y2={760} stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
        </g>
        {/* kotak orbital: ↑↓ boleh, ↑↑ tidak */}
        <g opacity={boxes}>
          {[
            {x: 660, ok: true},
            {x: 1260, ok: false},
          ].map((b) => (
            <g key={b.x}>
              <rect x={b.x - 90} y={560} width={180} height={140} rx={10} fill="rgba(12,18,40,0.85)" stroke={b.ok ? C.mint : C.red} strokeWidth={4} />
              <SpinArrow x={b.x - 40} y={630} up len={90} />
              <SpinArrow x={b.x + 40} y={630} up={!b.ok} len={90} />
              <Label x={b.x} y={740} size={30} color={b.ok ? C.mint : C.red} weight={700}>
                {b.ok ? '✓ spin berlawanan' : '✗ keempat bilangan kuantum sama'}
              </Label>
            </g>
          ))}
        </g>
      </Stage>
      <Badge x={960} y={250} text="STERN & GERLACH · 1922" color={C.cyan} opacity={sg} />
      <Formula x={960} y={250} p={win(t, cue(3), cue(5) - 0.1, 0.7, 0.4)} accent={C.red} caption="postulat 6: pertukaran dua fermion identik">
        <V>Ψ</V>(1, 2)&nbsp;=&nbsp;−<V>Ψ</V>(2, 1)
      </Formula>
      <Card x={960} y={420} opacity={slater * (1 - boxes)} accent={C.violet} style={{padding: '28px 46px'}}>
        <div style={{fontFamily: FONT.serif, fontSize: 56, whiteSpace: 'nowrap', textAlign: 'center'}}>
          <V>Ψ</V>&nbsp;=&nbsp;
          <Frac n="1" d={<Sqrt>2</Sqrt>} />
          [&thinsp;
          <span style={{position: 'relative', display: 'inline-block'}}>
            <V>χ</V>
            <Sub>a</Sub>(1)&thinsp;<V>χ</V>
            <Sub>{same > 0.5 ? 'a' : 'b'}</Sub>(2)
            <span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 4, background: C.red, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
          </span>
          &nbsp;−&nbsp;
          <span style={{position: 'relative', display: 'inline-block'}}>
            <V>χ</V>
            <Sub>{same > 0.5 ? 'a' : 'b'}</Sub>(1)&thinsp;<V>χ</V>
            <Sub>a</Sub>(2)
            <span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 4, background: C.red, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
          </span>
          &thinsp;]
          <span style={{opacity: zero, color: C.red}}>&nbsp;=&nbsp;0</span>
        </div>
        <div style={{fontFamily: FONT.sans, fontSize: 26, color: C.muted, textAlign: 'center', marginTop: 10}}>
          {same > 0.5 ? 'paksa b = a: dua suku identik' : 'determinan Slater dua elektron (antisimetri)'}
        </div>
      </Card>
      <Badge x={960} y={250} text="LARANGAN PAULI" color={C.gold} opacity={ramp(t, cue(7), cue(7) + 0.6, BACK)} />
    </AbsoluteFill>
  );
};
