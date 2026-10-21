// File: olah_data.js
// Praktik Manipulasi Array Of Object dengan ES6+

const project = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        compeleted: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App", 
        budget: 5000000,
        compeleted: true
    },
    {
        id: 3,
        title: "Lading Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        compeleted: false
    },
    {
        id: 4,  
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        compeleted: false
    }
];

// Herlper funcition format rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};

console.log("=== 1.SEMUA DAFTAR PROYEK (forEach) ===");
project.forEach((proj,idx) => {
    const status = proj.compeleted ? "[SELESAI]" : "[PROSES]";
    console.log(`${idx + 1}. ${status} ${proj.title} (${proj.category}) - ${formatRupiah(proj.budget)}`);
});

console.log("\n=== 2. PROYEK KATEGORI WEB APP (filter) ===");
const webProjects = project.filter(proj => proj.category === "Web App");
console.log(webProjects);

console.log("\n=== 3. RINGKASAN NAMA & ANGGARAN (map) ===");
const ringkasanProyek = project.map(proj => ({
  nama: proj.title,
  status: proj.compeleted ? "[SELESAI]" : "[PROSES]",
  biaya: formatRupiah(proj.budget)
  
}));
console.table(ringkasanProyek);

console.log("\n=== 4. TOTAL ANGGARAN (reduce) ===");
const totalAnggaran = project.reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Estimasi Anggaran Portofolio: ${formatRupiah(totalAnggaran)}`);

const totalSelesai = project
   .filter(proj => proj.compeleted )
   .reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Anggaran Proyek Selesai: ${formatRupiah(totalSelesai)}`);