import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, ramp, win} from '../anim';
import {Badge, Label, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {SpinArrow} from './Pauli';

// Bab 12: konfigurasi elektron karbon dari larangan Pauli + aturan Hund, lalu tabel periodik.
const BOX = 74;
const LEVELS = [
  {name: '1s', y: 760, n: 1, x: 420},
  {name: '2s', y: 600, n: 1, x: 420},
  {name: '2p', y: 540, n: 3, x: 640},
  {name: '3s', y: 400, n: 1, x: 420},
  {name: '3p', y: 360, n: 3, x: 640},
];
// urutan pengisian karbon: [tingkat, kotak, atas?]
const FILL: [number, number, boolean][] = [
  [0, 0, true],
  [0, 0, false],
  [1, 0, true],
  [1, 0, false],
  [2, 0, true],
  [2, 1, true],
];

// tabel periodik mini (golongan utama + transisi, tanpa lantanida/aktinida)
const cols = (row: number) => (row === 1 ? [1, 18] : row <= 3 ? [1, 2, 13, 14, 15, 16, 17, 18] : Array.from({length: 18}, (_, i) => i + 1));
const PT = {x: 1010, y: 440, c: 42};

export const Config: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const noPauli = win(t, cue(1) - 0.1, cue(2) - 0.1, 0.6, 0.5);
  const diag = ramp(t, cue(2) - 0.2, cue(2) + 0.8);
  const fillT = (k: number) => {
    // dua elektron 1s di baris 2, sisanya di baris 3–5
    const times = [cue(2) + 1.4, cue(2) + 2.2, cue(3) + 0.8, cue(3) + 1.5, wordOf(4, 'dua', 3) - 0.1, cue(5) + 1.2];
    return ramp(t, times[k], times[k] + 0.5, BACK);
  };
  const cfg = ramp(t, cue(4) - 0.2, cue(4) + 0.6);
  const hund = win(t, cue(5) + 0.6, cue(6) - 0.1, 0.5, 0.4);
  const table = ramp(t, cue(6) + 0.2, cue(6) + 1.2);
  const noble = ramp(t, wordOf(6, 'gas') - 0.2, wordOf(6, 'gas') + 0.6);
  const valence = ramp(t, wordOf(6, 'valensi') - 0.4, wordOf(6, 'valensi') + 0.4);
  const rows = ramp(t, cue(7) + 0.2, cue(7) + 1.4);
  return (
    <AbsoluteFill>
      <Stage>
        {/* tanpa Pauli: semua di 1s */}
        <g opacity={noPauli}>
          <rect x={960 - 200} y={520} width={400} height={150} rx={14} fill="rgba(60,14,30,0.5)" stroke={C.red} strokeWidth={4} />
          {Array.from({length: 6}, (_, k) => (
            <SpinArrow key={k} x={960 - 150 + k * 60} y={595} up len={100} />
          ))}
          <Label x={960} y={480} size={30} color={C.red} weight={700}>
            tanpa Pauli: semua elektron di 1s
          </Label>
          <Label x={960} y={720} size={26} color={C.muted}>
            semua unsur akan berperilaku mirip
          </Label>
        </g>
        {/* diagram tingkat energi */}
        <g opacity={diag}>
          <line x1={260} y1={820} x2={260} y2={320} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow-muted)" />
          <Label x={230} y={330} size={24} color={C.muted} anchor="end">
            E
          </Label>
          {LEVELS.map((l, li) => (
            <g key={l.name} opacity={li >= 3 ? 0.45 : 1}>
              {Array.from({length: l.n}, (_, b) => (
                <rect key={b} x={l.x + b * (BOX + 10)} y={l.y - BOX / 2} width={BOX} height={BOX} rx={8} fill="rgba(12,18,40,0.85)" stroke={C.faint} strokeWidth={3} />
              ))}
              <Label x={l.x - 30} y={l.y} size={30} color={C.ink} anchor="end" font="mono">
                {l.name}
              </Label>
            </g>
          ))}
          {FILL.map(([li, b, up], k) => {
            const p = fillT(k);
            const l = LEVELS[li];
            const twoInBox = FILL.filter(([lj, bj]) => lj === li && bj === b).length === 2;
            const dx = twoInBox ? (up ? -16 : 16) : 0;
            return <SpinArrow key={k} x={l.x + b * (BOX + 10) + BOX / 2 + dx} y={l.y + (1 - p) * -80} up={up} len={54} opacity={p} />;
          })}
          <g opacity={hund}>
            <rect x={LEVELS[2].x - 12} y={LEVELS[2].y - BOX / 2 - 12} width={3 * BOX + 44} height={BOX + 24} rx={14} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" />
            <Label x={LEVELS[2].x + 1.5 * BOX + 10} y={LEVELS[2].y - 80} size={28} color={C.gold} weight={700}>
              aturan Hund: sendiri-sendiri, spin sejajar
            </Label>
          </g>
        </g>
        {/* tabel periodik mini */}
        <g opacity={table}>
          {[1, 2, 3, 4, 5, 6, 7].map((row) =>
            cols(row).map((c) => {
              const x = PT.x + (c - 1) * PT.c;
              const y = PT.y + (row - 1) * PT.c;
              const isNoble = c === 18;
              const isC = row === 2 && c === 14;
              const lit = Math.max(isNoble ? noble : 0, isC ? 1 : 0);
              const len = row === 1 ? 2 : row <= 3 ? 8 : 18;
              const rowLit = rows * (row <= 4 ? 1 : 0.35);
              return (
                <rect
                  key={`${row}-${c}`}
                  x={x}
                  y={y}
                  width={PT.c - 4}
                  height={PT.c - 4}
                  rx={5}
                  fill={isC ? C.cyan : isNoble ? C.violet : c <= 2 && valence > 0 ? C.amber : C.faint}
                  opacity={0.25 + 0.6 * Math.max(lit, rowLit * (len > 0 ? 0.4 : 0), c <= 2 ? valence * 0.6 : 0)}
                />
              );
            }),
          )}
          <Label x={PT.x + 13 * PT.c + 18} y={PT.y + PT.c + 18} size={22} color={C.ink} weight={700}>
            C
          </Label>
          <g opacity={rows}>
            {[
              {row: 1, n: 2},
              {row: 2, n: 8},
              {row: 3, n: 8},
              {row: 4, n: 18},
            ].map((r) => (
              <Label key={r.row} x={PT.x - 20} y={PT.y + (r.row - 1) * PT.c + PT.c / 2 - 2} size={24} color={C.gold} anchor="end" font="mono">
                {`${r.n}`}
              </Label>
            ))}
            <Label x={PT.x - 20} y={PT.y - 30} size={20} color={C.gold} anchor="end">
              unsur/baris
            </Label>
          </g>
          <Label x={PT.x + 17 * PT.c + 18} y={PT.y - 30} size={22} color={C.violet} opacity={noble} weight={700}>
            gas mulia
          </Label>
        </g>
      </Stage>
      <Badge x={960} y={250} text="LARANGAN PAULI → ADA KIMIA" color={C.gold} opacity={win(t, cue(0) + 0.2, cue(1) - 0.1, 0.5, 0.4) * ramp(t, cue(0), cue(0) + 0.6, BACK)} />
      <div
        style={{
          position: 'absolute',
          left: 1010,
          top: 210,
          width: 760,
          textAlign: 'center',
          opacity: cfg,
          fontFamily: FONT.serif,
          fontSize: 64,
          color: C.ink,
          padding: '14px 0',
          borderRadius: 18,
          background: 'linear-gradient(160deg, rgba(22,30,58,0.82), rgba(8,11,24,0.82))',
          border: `1px solid ${C.cyan}55`,
        }}
      >
        <span style={{fontFamily: FONT.sans, fontSize: 30, color: C.cyan, marginRight: 24}}>₆C</span>
        1s<sup style={{fontSize: '0.6em'}}>2</sup>&nbsp;2s<sup style={{fontSize: '0.6em'}}>2</sup>&nbsp;2p<sup style={{fontSize: '0.6em'}}>2</sup>
      </div>
    </AbsoluteFill>
  );
};
