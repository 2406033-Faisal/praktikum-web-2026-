
const projects = [
    {
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

function updateStats(dataList) {
    const totalProjects = dataList.length;

    const totalBudget = dataList.reduce(
        (total, project) => total + project.budget,
        0
    );

    const completedProjects = dataList.filter(
        project => project.completed
    ).length;

    document.getElementById("stat-total-projects").textContent =
        totalProjects;

    document.getElementById("stat-total-budget").textContent =
        formatRupiah(totalBudget);

    document.getElementById("stat-completed-projects").textContent =
        completedProjects;
}

function renderProjects(filteredList) {
    const container = document.getElementById("project-list");

    if (filteredList.length === 0) {
        container.innerHTML =
            "<p>Tidak ada proyek pada kategori ini.</p>";
        return;
    }

    container.innerHTML = filteredList.map(project => `
        <div class="project-card">
            <div class="project-category">${project.category}</div>
            <h3>${project.title}</h3>
            <p>Anggaran: ${formatRupiah(project.budget)}</p>
            <span class="status-badge">
                ${project.completed ? "Selesai" : "Dalam Proses"}
            </span>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    renderProjects(projects);
    updateStats(projects);

    const filterButtons = document.querySelectorAll(".btn-filter");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;

            const filteredProjects = category === "Semua"
                ? projects
                : projects.filter(
                    project => project.category === category
                );

            renderProjects(filteredProjects);
            updateStats(filteredProjects);
        });
    });
});
