const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const corsOptions = {
  // origin: '*', // atau tentukan origin Anda, misalnya: "http://localhost:5000"
  origin: "http://127.0.0.1:5501", // atau tentukan origin Anda, misalnya: "http://localhost:5000"
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};
// Middleware
app.use(cors(corsOptions));
app.use(cors()); // Mengaktifkan CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint untuk menyimpan data
// app.post("/save", (req, res) => {
//   const { judul, penulis, gambar } = req.body;

//   if (!judul || !penulis || !gambar) {
//     return res.status(400).json({ message: "Semua field harus diisi!" });
//   }

//   // Lokasi file data
//   const dataDir = path.join(__dirname, "data");
//   const dataFile = path.join(dataDir, "data_buku.json");

//   // Membuat direktori data jika belum ada
//   if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir);
//   }

//   // Membaca file JSON
//   fs.readFile(dataFile, "utf8", (err, data) => {
//     const books = err ? [] : JSON.parse(data || "[]"); // Jika file tidak ditemukan, gunakan array kosong

//     // Menentukan ID baru
//     const lastBook = books[books.length - 1]; // Ambil elemen terakhir
//     const newId = lastBook ? lastBook.id + 1 : 1; // Jika ada, tambahkan 1 ke ID terakhir, jika tidak mulai dari 1

//     // Tambahkan buku baru dengan ID
//     const newBook = { id: newId, judul, penulis, gambar };
//     books.push(newBook);

//     // Menulis kembali ke file JSON
//     fs.writeFile(dataFile, JSON.stringify(books, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ message: "Gagal menyimpan data!" });
//       }

//       res.status(200).json({ message: "Data berhasil disimpan!", book: newBook });
//     });
//   });
// });

// // Endpoint untuk mengambil semua data buku
// app.get("/books", (req, res) => {
//   const dataDir = path.join(__dirname, "data");
//   const dataFile = path.join(dataDir, "data_buku.json");

//   // Cek apakah file data ada
//   if (!fs.existsSync(dataFile)) {
//     return res.status(404).json({ message: "Data buku tidak ditemukan!", data: [] });
//   }

//   // Baca file data
//   fs.readFile(dataFile, "utf8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ message: "Gagal membaca data buku!" });
//     }

//     const books = JSON.parse(data || "[]"); // Jika file kosong, gunakan array kosong
//     res.status(200).json({
//       message: "Data berhasil diambil!",
//       count: books.length, // Jumlah total buku
//       data: books, // Data buku
//     });
//   });
// });

// Endpoint untuk menyimpan data
app.post("/save", (req, res) => {
  const { judul, penulis, gambar } = req.body;

  if (!judul || !penulis || !gambar) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  // Lokasi file data
  const dataDir = path.join(__dirname, "data");
  const dataFile = path.join(dataDir, "data_buku.json");

  // Membuat direktori data jika belum ada
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Membaca file JSON
  fs.readFile(dataFile, "utf8", (err, data) => {
    const books = err ? [] : JSON.parse(data || "[]"); // Jika file tidak ditemukan, gunakan array kosong

    // Menentukan ID baru
    const newId = books.length ? books[books.length - 1].id + 1 : 1; // Jika ada, tambahkan 1 ke ID terakhir, jika tidak mulai dari 1

    // Tambahkan buku baru dengan ID
    const newBook = { id: newId, judul, penulis, gambar };
    books.push(newBook);

    // Menulis kembali ke file JSON
    fs.writeFile(dataFile, JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menyimpan data!" });
      }

      res.status(200).json({ message: "Data berhasil disimpan!", book: newBook });
    });
  });
});

app.get('/buku', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'data_buku.json'); // Path file JSON

  // Membaca file secara asinkron
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Gagal membaca file:', err);
          return res.status(500).json({ error: 'Gagal membaca data buku.' });
      }

      // Parse data JSON dan kirimkan sebagai response
      try {
          const buku = JSON.parse(data);
          res.json(buku);
      } catch (parseErr) {
          console.error('Gagal parse JSON:', parseErr);
          res.status(500).json({ error: 'Data JSON tidak valid.' });
      }
  });
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
