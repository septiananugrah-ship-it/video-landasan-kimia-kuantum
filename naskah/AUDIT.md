# Audit angka & istilah — *Aturan Main Kuantum* (Modul 2)

Semua angka di layar dan narasi, sumbernya, dan cara cek ulangnya.
Mengubah angka di naskah berarti baris itu harus direkam ulang (hapus `public/voiceover/<kode>.mp3`).

## Contoh dari Modul 2 (dihitung ulang)

| Bab | Angka | Cek |
|---|---|---|
| 02 Normalisasi | ∫₀ᴸ sin²(πx/L) dx = L/2 → A = √(2/L) | Contoh 3 modul |
| 02 Normalisasi | norma 27 → ψ = f/√27; "bukan 27 partikel" | Catatan koreksi no. 1 modul |
| 03 Superposisi | ψ = C(2φ₁ + iφ₂), \|C\|²(4 + 1) = 1 → C = 1/√5; peluang 4/5 dan 1/5 | Contoh 6 modul |
| 04 Operator | mesin T̂: T̂ sin(2πx) = +(2π²ħ²/m) sin(2πx) → keluaran digambar sebagai kelipatan **positif** sin(2πx) (sebelumnya keliru −sin); p̂ sin(2πx) = −2πiħ cos(2πx) → "∝ cos(2πx)" | turunan langsung |
| 04 Operator | baris 6 (linear): masukan × 1,6 → keluaran × 1,6 | definisi operator linear |
| 05 Eigen | d²/dx² sin(3πx/L) = −(9π²/L²) sin(3πx/L) | turunan langsung |
| 05 Eigen | k = 1,00 × 10¹⁰ m⁻¹: p = ħk = 1,05 × 10⁻²⁴ kg m s⁻¹; E = ħ²k²/2mₑ = 6,10 × 10⁻¹⁹ J = 3,81 eV | Contoh 15 modul; dihitung ulang dengan CODATA 2018 (ħ = 1,054572 × 10⁻³⁴ J s, mₑ = 9,109384 × 10⁻³¹ kg) |
| 06 Pengukuran | ψ = √(3/4) ψ₁ₛ + (i/2) ψ₂ₛ → P(E₁ₛ) = 3/4, P(E₂ₛ) = 1/4; E₁ₛ = −13,6 eV, E₂ₛ = −3,4 eV | Contoh 10 modul; Eₙ = −13,6/n² eV |
| 06 Pengukuran | histogram 120 percobaan: 88 : 32 (≈ 73 % : 27 %) | simulasi acak deterministik, mendekati 3/4 : 1/4 |
| 07 Nilai harapan | ⟨E⟩ = ¼(1) + ¾(4) = 3,25 eV; ⟨E²⟩ = 12,25 eV²; ΔE = √(12,25 − 10,5625) = 1,299 ≈ 1,30 eV | Contoh 11 modul + hitung ulang |
| 07 Nilai harapan | baris 0–1: 40 hasil ukur (tepat 10 × 1 eV dan 30 × 4 eV, urutan acak deterministik) → rata-rata berjalan berakhir di 3,25 eV; jungkat-jungkit miring ke sisi 3/4 (kanan) sebelum fulkrum pindah ke 3,25 | hitung langsung |
| 08 Komutator | [x̂, p̂] = iħ; Δx Δp ≥ ħ/2 (paket Gauss = batas minimum) | Contoh 14 modul |
| 11 Pauli | Ψ = (1/√2)[χₐ(1)χₐ(2) − χₐ(1)χₐ(2)] = 0 | Contoh 16 modul |
| 12 Konfigurasi | C: 1s² 2s² 2p², aturan Hund; jumlah unsur per baris 2, 8, 8, 18 | tabel periodik IUPAC |
| 12 Konfigurasi | baris 1 "tanpa Pauli": Li 3, C 6, Ne 10 elektron semuanya di 1s; baris 6: golongan 1 → 1 elektron valensi, golongan 14 (C) → 4 elektron valensi | nomor atom IUPAC |

## Nilai ukur / fakta dari luar modul

| Bab | Angka / fakta | Sumber |
|---|---|---|
| Pembuka | interferensi elektron satu per satu, Hitachi, 1989 (biprisma elektron, setara celah ganda) | A. Tonomura dkk., Am. J. Phys. 57, 117 (1989) |
| 01 | tafsiran peluang Born, 1926 | M. Born, Z. Phys. 37, 863 (1926) |
| 11 | Stern–Gerlach 1922, atom perak, berkas terbelah dua | W. Gerlach & O. Stern, Z. Phys. 9, 349 (1922) |
| 11 | ⁴He dan foton = boson; elektron = fermion | buku teks (Atkins, Levine) |
| 13 | panjang ikatan H₂ ≈ 0,741 Å → "0,74 Å" | NIST CCCBDB / CRC Handbook |
| 13 | entalpi ikatan H–H ≈ 436 kJ/mol (298 K); di layar panah dari v = 0 ke asimtot | CRC Handbook (D₀ pada 0 K ≈ 432 kJ/mol = 4,478 eV) |
| 13 | kurva Morse: Dₑ = 4,747 eV, a = 1,942 Å⁻¹, rₑ = 0,741 Å (ilustrasi bentuk kurva) | parameter Morse H₂ standar |
| 14 | Hα: n = 3 → 2, λ ≈ 656,3 nm (udara), E = 1239,84/656,3 = 1,889 ≈ 1,89 eV; garis Balmer 486,1 · 434,0 · 410,2 nm | NIST Atomic Spectra Database |
| 14 | elektron → UV/tampak, vibrasi → IR, rotasi → gelombang mikro | buku teks |
| 15 | γ/2π proton = 42,577 MHz/T ("42,6"); 9,4 T → 400 MHz; 1,5 T → 63,9 ≈ 64 MHz; 3 T → 127,7 ≈ 128 MHz | CODATA 2018 (γₚ/2π = 42,577 478 MHz/T) |
| 15 | spektrum NMR etanol skematis: CH₃ ≈ 1,2 ppm (triplet), CH₂ ≈ 3,7 ppm (kuartet), OH ≈ 2,6 ppm (singlet, bergantung pelarut/konsentrasi); luas puncak CH₃ : CH₂ : OH = 3 : 2 : 1 (jumlah H) | SDBS / buku teks spektroskopi |
| 16 | kafein C₈H₁₀N₄O₂: 24 inti, 102 elektron, 306 koordinat ruang | hitung: 8×6 + 10×1 + 4×7 + 2×8 = 102 |
| 16 | Nobel Kimia 1998: Walter Kohn (DFT) & John A. Pople (metode komputasi) | nobelprize.org |
| 17 | Nobel Fisika 2025: John Clarke, Michel H. Devoret, John M. Martinis — penerowongan kuantum makroskopis & kuantisasi energi dalam rangkaian listrik | nobelprize.org |
| 17 | target simulasi: klaster besi–belerang (kubana Fe₄S₄ digambar; Fe dan S berselang-seling di sudut kubus, tiap Fe terikat ke 3 S) — klaster Fe–S seperti kofaktor FeMoco nitrogenase adalah contoh baku molekul yang sulit bagi komputer biasa | M. Reiher dkk., PNAS 114, 7555 (2017) |

## Konvensi

- "≈" hanya untuk perkiraan; "±" tidak dipakai.
- Paket gelombang bab 9 adalah solusi analitik persamaan Schrödinger partikel bebas (ħ = m = 1), fase diwarnai roda warna.
- Gambar MRI, chip qubit, corong penyaringan, dan spektrum NMR/IR "sidik jari" bersifat skematis (diberi label di layar).
- Bab 17 kini memakai kubana Fe₄S₄ (struktur nyata, digambar skematis) sebagai contoh target; ikon cincin dengan Fe yang lama dihapus.
- Corong penyaringan bab 16 (34 kandidat, 1 dari 6 lolos), ikon farmasi/katalis/baterai, dan pola "sidik jari" bab 14 (molekul A/B, sampel cocok dengan A) bersifat skematis.
- Kartu rumus/lencana di satu posisi memakai `slot()` (`src/anim.ts`): kartu lama sudah hilang sebelum kartu berikutnya muncul — tidak ada dua kartu bertumpuk.
- Teks narasi tidak diubah pada tahap poles; `naskah/naskah-tts.txt` (kode → teks) dibuat `npm run timeline` untuk workflow *Cek pengucapan narasi (Whisper)*.
