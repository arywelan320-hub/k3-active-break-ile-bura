# Menyambungkan K3 Active Break ke Google Sheets

Google Sheet sudah dibuat secara privat:
https://docs.google.com/spreadsheets/d/1zOQSTimUdUW2cLbfXRp5TGytsbXK9JLiaIL4E7nQF4o/edit

## Tahap deployment yang memerlukan izin pemilik akun
1. Dari Google Sheet, buka **Ekstensi → Apps Script**, tempel kode dari `backend/Code.gs`.
2. Jalankan `buatKodeAksesPegawai` sekali untuk membuat 74 kode per pegawai (tab Akses bersifat RAHASIA). Jangan jalankan lagi tanpa rencana rotasi, karena akan mengganti semua kode lama.
3. Jalankan `buatKodeAdmin` sekali dan catat kode yang tampil di log. Bagikan kode pegawai secara individual; jangan terbitkan kode di GitHub atau grup.
4. Deploy Apps Script → New deployment → Web app → Execute as: Me → Who has access: Anyone. Salin URL berakhiran `/exec`. **Sheet tetap privat.**
5. Buat Cloudflare Worker dari `backend/cloudflare-worker.js`, tambahkan secret `APPS_SCRIPT_URL` berisi URL /exec tadi.
6. Tempel URL HTTPS Worker ke `backend-config.js` di repositori.
7. Uji login dengan kode pegawai serta satu sesi senam. Periksa tab Login dan Aktivitas. Admin dapat menggunakan kode admin untuk melihat daftar login.
8. Pada tab Pegawai, isi kolom D dengan nama singkat/alias, ubah kolom E menjadi `YA` **hanya setelah pegawai menyetujui** nama tersebut ditampilkan dalam papan peringkat.

Catatan keamanan: izin kamera wajib, tidak ada unggahan foto. Data deteksi hanya ringkasan perkiraan.
Google Sheets bukan sistem absensi resmi. Tombol Ya ikut bergerak merupakan pernyataan mandiri.
