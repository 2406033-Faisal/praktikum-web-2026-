// Interactive Portfolio Tracker - Modul 4 dan Tugas Mandiri Bab 3

let projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

let activeCategory = "Semua";
let searchKeyword = "";

const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
}).format(angka);

function updateStats(dataList = projects) {
    document.getElementById("stat-total-projects").textContent = dataList.length;

    const totalBudget = dataList.reduce((total, project) => total + project.budget, 0);
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);

    const completedProjects = dataList.filter(project => project.completed);
    document.getElementById("stat-completed-projects").textContent = completedProjects.length;

    const completedBudgetElement = document.getElementById("stat-completed-budget");
    if (completedBudgetElement) {
        const completedBudget = completedProjects.reduce((total, project) => total + project.budget, 0);
        completedBudgetElement.textContent = formatRupiah(completedBudget);
    }
}

function getVisibleProjects() {
    return projects.filter(project => {
        const matchesCategory = activeCategory === "Semua" || project.category === activeCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

function renderProjects() {
    const container = document.getElementById("project-list");
    const visibleProjects = getVisibleProjects();

    if (visibleProjects.length === 0) {
        container.innerHTML = '<p class="empty">Tidak ada proyek yang sesuai dengan pencarian atau kategori.</p>';
        updateStats(projects);
        return;
    }

    container.innerHTML = visibleProjects.map(project => `
        <article class="project-card">
            <div class="project-info">
                <span class="project-category">${project.category}</span>
                <h4>${escapeHTML(project.title)}</h4>
                <p class="project-budget">Anggaran: ${formatRupiah(project.budget)}</p>
                <span class="badge ${project.completed ? "badge-success" : "badge-pending"}">
                    ${project.completed ? "Selesai" : "Dalam Pengerjaan"}
                </span>
            </div>
            <div class="actions">
                <button type="button" class="btn-toggle" data-action="toggle" data-id="${project.id}">
                    ${project.completed ? "Ubah ke Pengerjaan" : "Ubah ke Selesai"}
                </button>
                <button type="button" class="btn-delete" data-action="delete" data-id="${project.id}">
                    Hapus Proyek
                </button>
            </div>
        </article>
    `).join("");

    updateStats(projects);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("project-form");
    const titleInput = document.getElementById("project-title");
    const categoryInput = document.getElementById("project-category");
    const budgetInput = document.getElementById("project-budget");
    const completedInput = document.getElementById("project-completed");
    const searchInput = document.getElementById("project-search");
    const filterButtons = document.querySelectorAll(".btn-filter");
    const projectList = document.getElementById("project-list");

    renderProjects();

    // Fitur 1: Form handling dan validasi
    form.addEventListener("submit", event => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const budget = Number(budgetInput.value);
        const completed = completedInput.checked;

        if (!title) {
            alert("Judul proyek wajib diisi.");
            titleInput.focus();
            return;
        }

        if (!Number.isFinite(budget) || budget <= 0) {
            alert("Anggaran harus berupa angka lebih besar dari 0.");
            budgetInput.focus();
            return;
        }

        const newProject = {
            id: Date.now(),
            title,
            category,
            budget,
            completed
        };

        projects = [...projects, newProject];
        form.reset();
        activeCategory = "Semua";
        searchInput.value = "";
        searchKeyword = "";

        filterButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.category === "Semua");
        });

        renderProjects();
    });

    // Fitur 2: Live search real-time
    searchInput.addEventListener("input", event => {
        searchKeyword = event.target.value.trim();
        renderProjects();
    });

    // Filter kategori yang digabungkan dengan pencarian
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category;
            filterButtons.forEach(item => item.classList.toggle("active", item === button));
            renderProjects();
        });
    });

    // Fitur 3: Tombol ubah status dan hapus proyek
    projectList.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "toggle") {
            projects = projects.map(project =>
                project.id === id
                    ? { ...project, completed: !project.completed }
                    : project
            );
        } else if (action === "delete") {
            const selectedProject = projects.find(project => project.id === id);
            if (!selectedProject) return;

            const confirmed = confirm(`Hapus proyek "${selectedProject.title}"?`);
            if (!confirmed) return;

            projects = projects.filter(project => project.id !== id);
        }

        renderProjects();
    });
});
