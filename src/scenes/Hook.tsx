import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, rand, ramp, win} from '../anim';
import {Badge, Glow, Label, Stage} from '../components/primitives';
import {fringe, sampleRho} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka: percobaan interferensi elektron satu per satu (Tonomura dkk., Hitachi, 1989).
// Kiri: penembak elektron + sekat dua celah. Kanan: layar tempat titik menumpuk.
export const SCR = {x: 760, y: 210, w: 1000, h: 600};
const GUN = {x: 230, y: 510};
const SLIT = {x: 520, y: 510};
const MAXDOTS = 5200;
export const HOOK_DOTS = sampleRho('hook', fringe, MAXDOTS, 1);

/** Jumlah titik pada waktu t: pelan dulu (satu per satu), lalu dipercepat. */
const countAt = (t: number, a: number, b: number, c: number) => {
  if (t < a) return 0;
  if (t < b) return Math.floor((t - a) / 0.42) + 1; // satu per satu
  const n0 = Math.floor((b - a) / 0.42) + 1;
  const p = ramp(t, b, c, EASE_IN_OUT);
  return Math.floor(n0 + (MAXDOTS - n0) * p * p);
};

export const DotScreen: React.FC<{count: number; x?: number; y?: number; w?: number; h?: number; fresh?: number; opacity?: number}> = ({
  count,
  x = SCR.x,
  y = SCR.y,
  w = SCR.w,
  h = SCR.h,
  fresh = 0,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    {HOOK_DOTS.slice(0, count).map((u, k) => {
      const isNew = fresh > 0 && k >= count - 1;
      const r = count < 200 ? 4.2 : count < 1500 ? 3 : 2.2;
      return <circle key={k} cx={x + u * w} cy={y + 14 + rand(k * 3.71 + 0.2) * (h - 28)} r={isNew ? r * (1 + 2 * fresh) : r} fill={isNew ? '#fff' : C.cyan} opacity={isNew ? 1 : 0.8} />;
    })}
  </g>
);

export const Hook: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const setup = ramp(t, 0.2, 1.6);
  const a = cue(0) + 2.2;
  const b = cue(2) - 0.2;
  const c = cue(3) - 0.4;
  const count = countAt(t, a, b, c);
  // satu elektron terbang dari penembak ke layar setiap kali titik baru muncul (fase pelan)
  const slow = t >= a && t < b;
  const ph = slow ? ((t - a) % 0.42) / 0.42 : 0;
  // elektron berikutnya (indeks = count) terbang: penembak → salah satu celah → titik tujuannya di layar
  const tu = HOOK_DOTS[count] ?? 0.5;
  const tx = SCR.x + tu * SCR.w;
  const ty = SCR.y + 14 + rand(count * 3.71 + 0.2) * (SCR.h - 28);
  const sy = rand(count * 5.3 + 0.7) < 0.5 ? 482 : 538;
  const fly = slow ? ph : -1;
  const q = Math.max(0, (fly - 0.4) / 0.6);
  const ex = fly < 0.4 ? GUN.x + 20 + (SLIT.x - GUN.x - 20) * (fly / 0.4) : SLIT.x + (tx - SLIT.x) * q;
  const ey = fly < 0.4 ? GUN.y + (sy - GUN.y) * (fly / 0.4) : sy + (ty - sy) * q;
  const fresh = slow ? 1 - ramp(ph, 0, 0.6) : 0;
  const curve = ramp(t, cue(3) - 0.2, cue(3) + 1.2);
  const ask = win(t, cue(4) - 0.2, cue(5) - 0.2, 0.6, 0.5);
  const psiOn = ramp(t, wordOf(5, 'fungsi') - 0.3, wordOf(5, 'fungsi') + 0.8);
  const rules = ramp(t, wordOf(5, 'enam') - 0.2, wordOf(5, 'enam') + 1.0, BACK);
  const fpath = Array.from({length: 241}, (_, k) => {
    const u = k / 240;
    return `${k ? 'L' : 'M'}${(SCR.x + u * SCR.w).toFixed(1)},${(SCR.y + SCR.h - 30 - fringe(u) * 300).toFixed(1)}`;
  }).join(' ');
  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={setup}>
          {/* penembak elektron */}
          <rect x={GUN.x - 120} y={GUN.y - 40} width={120} height={80} rx={14} fill="#1a2444" stroke={C.muted} strokeWidth={2.5} />
          <rect x={GUN.x - 6} y={GUN.y - 16} width={26} height={32} rx={6} fill="#24305a" stroke={C.muted} strokeWidth={2} />
          <Glow x={GUN.x + 14} y={GUN.y} r={40} color="cyan" opacity={0.5 + 0.3 * Math.sin(t * 6)} />
          <Label x={GUN.x - 60} y={GUN.y + 76} size={22} color={C.muted}>
            sumber elektron
          </Label>
          {/* sekat dua celah */}
          <rect x={SLIT.x - 8} y={240} width={16} height={232} fill="#3a4466" />
          <rect x={SLIT.x - 8} y={492} width={16} height={36} fill="#3a4466" />
          <rect x={SLIT.x - 8} y={548} width={16} height={232} fill="#3a4466" />
          <Label x={SLIT.x} y={812} size={22} color={C.muted}>
            dua celah
          </Label>
          {/* layar */}
          <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={10} fill="rgba(6,10,24,0.85)" stroke={C.faint} strokeWidth={3} />
        </g>
        {fly >= 0 ? (
          <g>
            <circle cx={ex} cy={ey} r={9} fill={C.cyan} filter="url(#glow)" />
          </g>
        ) : null}
        <DotScreen count={count} fresh={fresh} />
        <g opacity={setup}>
          <Label x={SCR.x + SCR.w - 20} y={SCR.y - 30} size={28} color={C.gold} anchor="end" font="mono" weight={600}>
            {`N = ${count.toLocaleString('id-ID')}`}
          </Label>
          <Label x={SCR.x} y={SCR.y - 30} size={24} color={C.muted} anchor="start">
            layar detektor
          </Label>
        </g>
        <g opacity={curve * (1 - psiOn)}>
          <path d={fpath} fill="none" stroke={C.gold} strokeWidth={5} filter="url(#glow)" />
          <rect x={SCR.x + SCR.w / 2 - 170} y={SCR.y + 24} width={340} height={54} rx={14} fill="rgba(6,10,24,0.88)" stroke={C.gold} strokeWidth={2} />
          <Label x={SCR.x + SCR.w / 2} y={SCR.y + 50} size={34} color={C.gold} weight={700}>
            pola interferensi
          </Label>
        </g>
        <g opacity={psiOn}>
          <path d={fpath} fill="none" stroke={C.violet} strokeWidth={6} filter="url(#glow)" />
          <rect x={SCR.x + SCR.w / 2 - 80} y={SCR.y + 20} width={160} height={62} rx={14} fill="rgba(6,10,24,0.9)" stroke={C.violet} strokeWidth={2} />
          <Label x={SCR.x + SCR.w / 2} y={SCR.y + 50} size={40} color={C.violet} weight={700} font="serif" italic>
            |ψ|²
          </Label>
        </g>
        <g opacity={ask}>
          <Glow x={SLIT.x - 150} y={330} r={120} color="gold" opacity={0.3} />
          <text x={SLIT.x - 150} y={350} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={150} fill={C.gold} opacity={0.9}>
            ?
          </text>
        </g>
      </Stage>
      {[1, 2, 3, 4, 5, 6].map((n, i) => {
        const p = ramp(t, wordOf(5, 'enam') + i * 0.12, wordOf(5, 'enam') + 0.6 + i * 0.12, BACK) * rules;
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: 120 + i * 90,
              top: 150,
              width: 66,
              height: 66,
              borderRadius: 33,
              border: `2px solid ${C.gold}`,
              background: 'rgba(30,24,8,0.7)',
              color: C.gold,
              fontFamily: FONT.mono,
              fontSize: 32,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: p,
              transform: `scale(${0.6 + 0.4 * p})`,
            }}
          >
            {n}
          </div>
        );
      })}
      <Badge x={330} y={260} text="TONOMURA DKK. · 1989" color={C.cyan} opacity={win(t, cue(0) + 0.4, cue(2), 0.6, 0.6)} />
    </AbsoluteFill>
  );
};
