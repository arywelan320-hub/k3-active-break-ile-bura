# K3 Active Break • UPTD Puskesmas Ile Bura

Aplikasi web ringan untuk memilih profesi/nama pegawai, melihat jadwal senam, menonton video YouTube di dalam aplikasi, mengonfirmasi kegiatan secara mandiri, dan membagikan QR Code.

## Cara mencoba secara lokal

1. Ekstrak ZIP ini.
2. Di folder proyek, jalankan `python3 -m http.server 8000`.
3. Buka `http://localhost:8000` pada browser.
4. Pilih profesi dan nama **contoh** untuk menguji dashboard.

> Perhatian: nama pada versi awal adalah **contoh**, bukan database 73 pegawai sesungguhnya.

## Mengunggah ke GitHub Pages

1. Buat repositori **baru** bernama `k3-active-break-ile-bura` pada akun GitHub Anda.
2. Pilih **Public** untuk paket prototipe ini yang tidak menyimpan daftar pegawai asli.
3. Buka repositori, pilih **Add file → Upload files**.
4. Unggah **isi folder** proyek (termasuk `index.html`, `app.js`, `style.css`, `sw.js`, `manifest.webmanifest`, dan folder `assets`), bukan file ZIP-nya. Commit.
5. Buka **Settings → Pages**.
6. Pada **Build and deployment**, pilih **Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
7. Situs akan tersedia pada alamat `https://arywelan320-hub.github.io/k3-active-break-ile-bura/` setelah GitHub Pages berhasil menerbitkannya. Periksa status deployment sebelum membagikan alamat.

## Konsep penggunaan

- Pegawai memilih **profesi**, lalu **nama**. Nama yang dipilih diingat pada perangkat yang sama.
- Jadwal contoh: 07.00, 08.30, 10.00, 11.30, 13.00, 14.15 WITA.
- Video yang sudah dimuat: **Kementerian PANRB** (dua video) dan **Puskesmas Sepinggan** (satu video).
- Video ditampilkan menggunakan YouTube Embed, jika pemilik video mengizinkannya. Video baru dapat ditambahkan dari menu **Pengaturan** untuk uji coba lokal.
- Pegawai dapat menyatakan telah mengikuti senam. Pernyataan ini **bukan bukti objektif** bahwa gerakan benar-benar dilakukan.
- Riwayat kegiatan disimpan dengan `localStorage` browser, dan dapat diekspor ke CSV pada perangkat tersebut.
- QR Code dibuat menggunakan layanan `api.qrserver.com` dari alamat situs yang aktif. Halaman QR memerlukan koneksi internet.

## Mengimpor daftar pegawai

Gunakan file CSV ber-header `nama,profesi,unit` (lihat `template_pegawai.csv`) melalui menu **Pengaturan → Impor data pegawai**. Jangan masukkan NIP atau data kesehatan. Versi prototipe ini menyimpan hasil impor **hanya di perangkat yang melakukan impor**, tidak membagikannya ke HP lain.

Untuk aplikasi produksi dengan 73 nama pegawai bersama dan laporan real-time, diperlukan **database terpusat yang diautentikasi**, kebijakan akses khusus admin, dan layanan sinkronisasi yang aman. **Jangan menaruh daftar 73 nama, informasi personal, token API, atau kredensial ke repositori GitHub Pages publik.**

## Fitur yang belum tersedia (butuh backend / tahap berikutnya)

- Login pegawai terverifikasi dan pengaturan admin dengan hak akses.
- Sinkronisasi Google Sheets terpusat lintas HP; pengaturan pada versi ini *bukan* admin terpusat.
- Push notification ketika aplikasi/browser tertutup. Versi ini hanya menampilkan pengingat selama halaman sedang berjalan.
- Pengelolaan jadwal dan daftar video terpusat untuk semua perangkat.
- Penentuan hari kerja/libur sesuai kebijakan Puskesmas.

## Kepatuhan konten dan privasi

Gunakan video lewat player embed resmi. Jangan mengunduh atau mengunggah ulang video milik pihak lain tanpa izin yang sesuai. Sesuaikan gerakan dengan kemampuan peserta dan kebutuhan pelayanan pasien.

Dibuat sebagai prototipe UI/UX, bukan sistem absensi K3 resmi.
