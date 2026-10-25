# Aturan Main Kuantum — video Modul 2 Kimia Kuantum

Film edukasi **Landasan Kimia Kuantum** (Modul 2, S1 Kimia UNESA), dibuat dengan [Remotion](https://remotion.dev).
1920 × 1080 / 2560 × 1440 · 30 FPS · **±18 menit** (estimasi sebelum narasi direkam) · 18 bab + pembuka, judul, peta video, dan penutup.
Mesin video sama dengan repo `video-partikel-kotak` (Modul 3): naskah → timeline → subtitle kata-per-kata → musik orisinal.

## Alur

| Bagian | Bab |
|---|---|
| — | Pembuka: elektron ditembakkan satu per satu dan titik-titiknya membentuk pola interferensi (Tonomura dkk., Hitachi 1989) · Judul · Peta video |
| 1 · Teori dasar | 01 Fungsi gelombang (Ψ kompleks, panah fase, \|Ψ\|² rapat peluang Born) · 02 Normalisasi (√(2/L), norma 27 ≠ 27 partikel, syarat fungsi berperilaku baik) · 03 Superposisi & ortogonalitas (luas φ₁φ₂ = 0, C = 1/√5, peluang 4/5 & 1/5) · 04 Operator (mesin fungsi: x̂, p̂ = −iħ d/dx, T̂, Ĥ; Hermitian → nilai real) · 05 Fungsi & nilai eigen (e^{ikx}: eigen p̂ dan T̂, bukan x̂; k = 10¹⁰ m⁻¹ → 3,81 eV) · 06 Pengukuran (√(3/4) ψ₁ₛ + (i/2) ψ₂ₛ, histogram 3/4 : 1/4, runtuh) · 07 Nilai harapan (titik seimbang 3,25 eV, ΔE ≈ 1,30 eV, ⟨p⟩ = 0 ≠ diam) · 08 Komutator & ketidakpastian ([x̂, p̂] = iħ, Gauss sempit ↔ lebar, [L̂², L̂z] = 0) · 09 Persamaan Schrödinger bergantung waktu (paket bebas merambat & melebar, runtuh saat diukur) · 10 Keadaan stasioner (fase berputar, \|ψ\|² tetap; superposisi berayun → cahaya ν = ΔE/h) · 11 Partikel identik & spin (Stern–Gerlach 1922, fermion/boson, determinan Slater = 0, larangan Pauli) |
| 2 · Implementasi kimia | 12 Konfigurasi elektron (karbon 1s² 2s² 2p², Hund, tabel periodik) · 13 Ikatan H₂ (LCAO σ & σ*, 0,74 Å, ≈ 436 kJ/mol) · 14 Spektroskopi (Hα 656 nm = 1,89 eV, daerah spektrum, sidik jari) |
| 3 · Industri | 15 NMR & MRI (γ/2π = 42,58 MHz/T, 400 MHz ↔ 9,4 T, 1,5 T ↔ 64 MHz) · 16 Kimia komputasi (kafein 102 elektron, basis & iterasi SCF, DFT, Nobel Kimia 1998) · 17 Komputer kuantum (qubit, pembacaan = pengukuran, Nobel Fisika 2025) |
| — | 18 Rangkuman enam aturan · Penutup & rujukan |

Daftar bab bertimecode untuk YouTube: `naskah/BAB_YOUTUBE.txt` (diperbarui otomatis setelah narasi direkam).
Semua angka & sumbernya: `naskah/AUDIT.md`.

## Cara menjalankan (render di GitHub Actions)

Semua langkah dijalankan dari tab **Actions** repo ini (bisa dari iPad). Tombol *Run workflow* hanya muncul untuk workflow yang sudah ada di branch `main`.

1. **Merge PR** ke `main` (sekali saja).
2. **Secret**: pastikan **`ELEVENLABS_API_KEY`** ada di *Settings → Secrets and variables → Actions* repo ini. Secret repo lain tidak ikut terbawa; tanpa secret ini langkah TTS gagal dengan kunci kosong.
3. Actions → **Buat voice-over ElevenLabs + render 2K** → *Run workflow*. Isian bawaan sudah benar:

   | Isian | Nilai |
   |---|---|
   | `voice_id` | `aJiaMo73BheNakP6EPev` (Bagas) |
   | `model` | `eleven_v4` |
   | `ulang_semua` | tidak dicentang (hanya baris yang belum punya MP3 yang dibuat) |
   | `render` | dicentang |

   Workflow membuat MP3 per baris (`public/voiceover/<kode>.mp3`, 150 baris), mengukur durasi & jeda, menyesuaikan timeline, subtitle, musik, dan `naskah/BAB_YOUTUBE.txt`, menyimpannya ke `main`, lalu merender **dua versi** 2K (2560 × 1440, 30 FPS, H.264) secara paralel (12 potongan per versi):
   - artefak **`aturan-kuantum-dengan-narasi-2k-30fps`** — narasi + musik pelan + subtitle,
   - artefak **`aturan-kuantum-tanpa-narasi-2k-30fps`** — musik + subtitle tanpa suara (untuk dubbing sendiri).

   Unduh di halaman run → bagian *Artifacts* (iPad: tekan lama → *Unduh Tautan Tertaut*). Artefak tersimpan 14 hari.
4. (Disarankan) Actions → **Cek pengucapan narasi (Whisper)** → *Run workflow* (model `small`; baris yang ditandai dicek ulang dengan `medium`). Hasil: ringkasan run + artefak `cek-pengucapan-*` (`naskah/CEK_PENGUCAPAN.md`). Kata bertanda sering alarm palsu; untuk merekam ulang satu baris, hapus `public/voiceover/<kode>.mp3` di `main` lalu jalankan lagi langkah 3.

**Render ulang tanpa membuat suara** (mis. setelah memperbaiki animasi): Actions → **Render Aturan Main Kuantum 2K 30FPS** → *Run workflow*:

| Versi | `props` | `nama` |
|---|---|---|
| dengan narasi (butuh MP3 dari langkah 3) | `{"showCaptions":true,"musicVolume":0.35,"voiceover":true}` | `dengan-narasi` |
| tanpa narasi | `{"showCaptions":true,"musicVolume":0.9,"voiceover":false}` | `tanpa-narasi` |

Pilih `resolusi` = `1080p` untuk berkas lebih kecil. Sebelum narasi direkam, timeline memakai estimasi 5,3 suku kata/dtk (±18 menit); setelah narasi direkam, durasinya mengikuti suara.

## Intro SCIENTIAN

Unggah intro 30 FPS ke `intro/intro.mp4` (lihat `intro/README.md`); render berikutnya otomatis menghasilkan juga `…-dengan-intro.mp4`.

## Mengubah naskah

Edit `src/script.ts`, lalu `npm run timeline && npm run music`. Pratinjau: `npm run dev` (folder *Adegan* berisi tiap adegan).
QA (lokal, butuh `CHROME_PATH` ke chrome-headless-shell): `node scripts/qa-audit.mjs out/audit` lalu `python3 scripts/contact.py out/audit out/sheets` (lembar kontak per adegan);
`node scripts/qa-moments.mjs out/m adegan:baris:offset …` untuk momen tertentu;
`node --experimental-strip-types scripts/check-cues.ts` memeriksa penanda kata `wordOf`.
Adegan baru: tambahkan ke daftar di `scripts/gen-scenes.py` lalu jalankan skrip itu (menulis `src/scenes/index.ts`).

## Catatan ilmiah

Contoh hitungan mengikuti Modul 2 (contoh 3, 6, 10, 11, 14, 15, 16) dan dihitung ulang dengan CODATA 2018.
Paket gelombang bab 9 adalah solusi analitik persamaan Schrödinger partikel bebas; warna menunjukkan fase ψ.
Nilai ukur (H₂, Hα, γ proton) ditandai "≈" dan dirujuk di layar penutup. MRI, chip qubit, spektrum NMR, dan "sidik jari" digambar skematis.
