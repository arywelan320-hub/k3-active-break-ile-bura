# Aktivasi Database & K3 Active Heroes (UPTD Puskesmas Ile Bura)

Status: **Google Sheets dan kode aplikasi sudah disiapkan; backend belum aktif sampai deployment selesai.**
Aplikasi: https://arywelan320-hub.github.io/k3-active-break-ile-bura/
Database (PRIVAT): https://docs.google.com/spreadsheets/d/1zOQSTimUdUW2cLbfXRp5TGytsbXK9JLiaIL4E7nQF4o/edit

## 1. Periksa database
Spreadsheet sudah berisi 74 pegawai pada tab **Pegawai**, serta tab **Akses**, **Login**, **Aktivitas**, **Peringkat**, **Panduan** dan **Pengaturan**. Jangan jadikan Google Sheets publik. Jangan masukkan kode rahasia ke GitHub.

## 2. Pasang Google Apps Script
1. Buka database → **Ekstensi → Apps Script**. Gunakan akun Google yang memiliki hak edit.
2. Hapus isi awal Code.gs pada editor Apps Script, lalu tempel **seluruh isi** file `backend/Code.gs` dari repositori GitHub.
3. Simpan. Pilih fungsi **buatKodeAksesPegawai**, klik **Jalankan**, lalu izinkan akses Google Sheets.
4. Kembali ke tab **Akses**: kode rahasia tiap pegawai tersedia pada kolom E. **Bagikan kode secara pribadi**, jangan unggah screenshot atau kirim seluruh daftar ke grup.
5. Jalankan fungsi **buatKodeAdmin** sekali. Salin kode dari log eksekusi ke penyimpanan aman, jangan kirim di grup. Jangan menjalankannya ulang kecuali ingin mengganti kode admin.
6. Jalankan fungsi **cekKesiapan**; pastikan log menampilkan `SIAP: 74 pegawai`.
7. Klik **Deploy → New deployment → Web app**. Pilih **Execute as: Me** dan **Who has access: Anyone**. Klik **Deploy** dan simpan URL yang berakhir dengan `/exec`. Jangan letakkan URL tersebut dalam kode frontend publik.

**Penting:** Web app Apps Script memang dapat diakses publik melalui URL-nya, tetapi seluruh aksi memeriksa kode pegawai di server. Kode akses bukan bukti identitas yang kuat; bagikan secara privat dan ganti jika bocor. Pertimbangkan kebijakan perlindungan data dan persetujuan pegawai sebelum digunakan secara resmi.

## 3. Pasang Cloudflare Worker
1. Buka Cloudflare Dashboard → Workers & Pages → Create Worker.
2. Tempel isi `backend/cloudflare-worker.js` sebagai kode Worker dan deploy.
3. Di Settings → Variables and Secrets, buat **Secret** bernama `APPS_SCRIPT_URL` dengan nilai URL `/exec` dari langkah 2. Jangan memasukkan URL atau kode admin ke source Worker/GitHub.
4. Simpan lalu deploy ulang. Salin URL publik Worker `https://...workers.dev`.
5. Buka file `backend-config.js` di GitHub dan isi **hanya** alamat Worker, contoh:
   `window.K3_BACKEND_URL='https://nama-worker.nama-akun.workers.dev';`
   URL Worker memang publik; **tidak boleh** menyimpan kode admin atau kode pegawai dalam file ini.
6. Tunggu GitHub Pages diperbarui lalu muat ulang aplikasi.

Jika Cloudflare tidak tersedia, jangan memasukkan URL Apps Script langsung ke halaman: permintaan lintas origin dan perlindungan data perlu diuji terlebih dahulu.

## 4. Uji end-to-end sebelum dipakai seluruh pegawai
- Masuk aplikasi dengan salah satu nama pegawai.
- Buka **Heroes** dan masukkan kode akses pribadi yang cocok.
- Pastikan status `Tersinkron ke Google Sheets` muncul.
- Periksa tab **Login** di Sheets, seharusnya bertambah satu baris untuk pegawai tersebut pada hari yang sama.
- Ikuti satu sesi senam dan pilih **Ya, saya ikut bergerak**. Periksa tab **Aktivitas**: hanya satu catatan untuk kombinasi pegawai, tanggal, sesi.
- Coba konfirmasi sesi yang sama lagi: poin server tidak boleh bertambah.
- Aktifkan alias sukarela di Heroes; periksa papan peringkat Mingguan/Bulanan dan tab **Peringkat**.
- Buka **Monitoring**, masukkan kode admin; daftar nama dan jam login hanya tampil pada halaman admin.
- Uji kamera dengan izin di HP Android dan laptop; pratinjau terlihat dan kamera berhenti saat video ditutup.
- Uji tanpa koneksi internet: riwayat lokal masih ada, tetapi tidak dianggap tersinkron. Saat ini aktivitas yang gagal dikirim **tidak otomatis diunggah ulang**, jadi perlu prosedur rekonsiliasi sebelum laporan resmi.

## Batasan dan perlindungan data
- Login memilih nama bukan autentikasi. Kode pegawai diperlukan untuk pencatatan terpusat.
- Peringkat adalah hasil **konfirmasi mandiri**, bukan verifikasi gerakan atau absensi resmi.
- Kamera opsional, aktif setelah izin, analisis di perangkat, tidak menyimpan foto atau video.
- Admin hanya melihat daftar nama setelah kode pegawai dan kode admin terverifikasi.
- Peringkat publik di dalam aplikasi hanya menampilkan alias yang disetujui pegawai.
- Pengingat saat aplikasi ditutup **belum tersedia**. Push notification memerlukan layanan push, persetujuan, dan infrastruktur server tersendiri.
- Backend belum memiliki pembatasan percobaan kode tingkat produksi. Untuk peluncuran luas, tambahkan rate limiting di Cloudflare dan kebijakan rotasi kode.
