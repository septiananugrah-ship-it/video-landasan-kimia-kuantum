import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {PhaseWave, freePacket} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'Modul 2 Kimia Kuantum — Landasan Kimia Kuantum (bahan kuliah IGMA Sanjaya, UNESA)',
  'P. Atkins & J. de Paula, Physical Chemistry · I. N. Levine, Quantum Chemistry · D. A. McQuarrie, Quantum Chemistry',
  'CODATA 2018 (NIST): h, ħ, mₑ, e · NIST Atomic Spectra Database: garis Hα 656,3 nm',
  'A. Tonomura dkk., Am. J. Phys. 57, 117 (1989) — interferensi elektron satu per satu',
  'W. Gerlach & O. Stern, Z. Phys. 9, 349 (1922) — pemisahan berkas atom perak',
  'M. Born, Z. Phys. 37, 863 (1926) — tafsiran peluang fungsi gelombang',
  'W. Pauli, Z. Phys. 31, 765 (1925) — prinsip larangan',
  'CRC Handbook of Chemistry and Physics — entalpi ikatan H–H ≈ 436 kJ/mol, panjang ikatan 0,741 Å',
  'NIST/CODATA: rasio giromagnetik proton γ/2π ≈ 42,577 MHz/T',
  'The Nobel Prize in Chemistry 1998 (W. Kohn, J. A. Pople) — nobelprize.org',
  'The Nobel Prize in Physics 2025 (J. Clarke, M. H. Devoret, J. M. Martinis) — nobelprize.org',
  'MIT OCW 5.73 (2005) — partikel identik & determinan Slater',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.6);
  const waves = ramp(t, 0, 4, EASE_IN_OUT);
  const refs = ramp(t, 2.4, 3.4);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={300} r={500} color="violet" opacity={0.15} />
        <g opacity={0.3 * waves}>
          <PhaseWave f={(u) => freePacket((u - 0.5) * 24, 0.3 + t * 0.1, -5 + t * 0.4, 1.6, 4)} x={260} y={330} w={1400} sy={90} n={200} outline={false} mirror />
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
        <div style={{fontFamily: FONT.sans, fontSize: 30, letterSpacing: 18, color: C.ink, fontWeight: 300, opacity: a}}>LANDASAN KIMIA KUANTUM</div>
        <div style={{fontFamily: FONT.sans, fontSize: 100, fontWeight: 800, color: C.gold, lineHeight: 1.05, opacity: a, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>ATURAN MAIN KUANTUM</div>
        <div style={{marginTop: 22, fontFamily: FONT.sans, fontSize: 34, color: C.ink, opacity: ramp(t, 1.2, 2.2)}}>Terima kasih telah menonton</div>
        <div style={{marginTop: 46, textAlign: 'center', opacity: refs}}>
          <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 4, color: C.muted, marginBottom: 14}}>RUJUKAN</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, rowGap: 6, width: 1720, textAlign: 'left'}}>
            {REFS.map((r, i) => (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 21, color: C.muted, lineHeight: 1.45, opacity: ramp(t, 2.4 + i * 0.08, 3.2 + i * 0.08)}}>
                {r}
              </div>
            ))}
          </div>
          <div style={{marginTop: 22, fontFamily: FONT.sans, fontSize: 20, color: C.faint}}>
            Contoh angka mengikuti Modul 2 · paket gelombang: solusi analitik persamaan Schrödinger partikel bebas · nilai ukur ditandai “≈” · ilustrasi alat &amp; molekul skematis
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
