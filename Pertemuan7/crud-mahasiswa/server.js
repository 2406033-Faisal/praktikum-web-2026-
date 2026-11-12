const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// Koneksi ke data base 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_kampus",
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi Gagal:", err.message);
        return;
    }
    console.log("Terhubung ke database MySQL!");
});

// Api Endpoin sederhana
app.get("/api/mahasiswa", (req, res) => {
    db.query("SELECT * FROM mahasiswa ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ 
            success: false,
            message: err.message
        });
        res.json(results);
    });
});

// 2.Tambah data mahasiswa

app.post("/api/mahasiswa", (req, res) => {
    const { nim, nama, jurusan, email} = req.body;
    const sql = "INSERT INTO mahasiswa (nim, nama, email, jurusan) VALUES (?, ?, ?, ?)";
    db.query(sql, [nim, nama, email, jurusan], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json({ 
            success: true,
            message: "Data mahasiswa berhasil ditambahkan",
        });
    });
});

// 3. Edit Mahasiswa
app.put("/api/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    const { nim, nama, jurusan, email } = req.body;
    const sql = "UPDATE mahasiswa SET nim = ?, nama = ?, email = ?, jurusan = ? WHERE id = ?";

    db.query(sql, [nim, nama, email, jurusan, id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil diperbarui"
        });
    });
});

// 4. Hapus Mahasiswa
app.delete("/api/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM mahasiswa WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });

        res.json({
            success: true,
            message: "Data mahasiswa berhasil dihapus"
        });
    });
});

// gatau
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend berjalan!",
        docs: "Akses API di /api/mahasiswa"
    });
});

app.listen(port, () => {
    console.log("Server berjalan pada port:", port);
});

