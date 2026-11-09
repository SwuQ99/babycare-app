# BabyCare

Prototaip Bahasa Melayu untuk pusat penjagaan postnatal. Buka `index.html` dalam pelayar; tiada pemasangan diperlukan.

## Aliran demo
- Pengurus: ringkasan pusat, senarai bayi dan jadual.
- Kakitangan: tugasan, rekod baru dan sejarah bagi bilik Melur.
- Ibu: aktiviti, sejarah dan notifikasi contoh Baby Aisyah.

## Semakan automatik
Jalankan `node --test tests/demo.test.cjs` menggunakan Node.js. Ujian memeriksa permulaan aplikasi, paparan peranan, penapisan bilik, susunan sejarah, pengendalian input dan penetapan semula. Ujian ini tidak menggantikan semakan visual dalam pelayar.

## Status dan kerja seterusnya
Ralat sintaks permulaan, susunan sejarah dan skop rekod kakitangan telah dibaiki. Data demo hanya berada dalam memori dan kembali kepada asal apabila halaman dimuat semula.

Sebelum kegunaan sebenar, aplikasi memerlukan log masuk, kawalan akses di pelayan, pangkalan data, rekod audit dan pengurusan jadual bertarikh. Penukar peranan dan semakan dalam pelayar ini bukan kawalan keselamatan sebenar. Gunakan data rekaan sahaja.
