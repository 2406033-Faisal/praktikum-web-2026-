// File: script.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    // Elemen counter dan tombol bersihkan
    const totalTasks = document.querySelector("#totalTasks");
    const completedTasks = document.querySelector("#completedTasks");
    const pendingTasks = document.querySelector("#pendingTasks");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () =>
        JSON.parse(localStorage.getItem("todo_tasks")) || [];

    const saveTasks = (tasks) =>
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // 3. Fungsi memperbarui counter tugas
    const updateCounter = () => {
        const tasks = getTasks();

        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;

        totalTasks.textContent = tasks.length;
        completedTasks.textContent = completed;
        pendingTasks.textContent = pending;
    };

    // 4. Fungsi menampilkan daftar tugas
    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";

        if (tasks.length === 0) {
            todoList.innerHTML = `
                <li class="empty-message">
                    Belum ada tugas tersimpan.
                </li>
            `;

            updateCounter();
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text"></span>

                <div class="todo-actions">
                    <button
                        type="button"
                        class="action-btn complete-btn"
                        data-index="${index}"
                    >
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-index="${index}"
                    >
                        Hapus
                    </button>
                </div>
            `;

            // Memasukkan teks sebagai teks biasa
            li.querySelector(".todo-text").textContent = task.text;

            todoList.appendChild(li);
        });

        // Perbarui counter setelah daftar ditampilkan
        updateCounter();
    };

    // 5. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        // Validasi input minimal 3 karakter
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.textContent =
                "Tugas tidak boleh kurang dari 3 karakter!";
            inputError.style.display = "block";
            taskInput.focus();
            return;
        }

        const tasks = getTasks();

        // Batas maksimal 5 tugas
        if (tasks.length >= 5) {
            taskInput.classList.add("error");
            inputError.textContent =
                "Maksimal hanya boleh ada 5 tugas!";
            inputError.style.display = "block";
            taskInput.focus();
            return;
        }

        // Hilangkan pesan error jika input valid
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru
        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        taskInput.value = "";

        // Tampilkan ulang daftar dan counter
        renderTasks();
    });

    // 6. Tangani tombol Selesai, Batal, dan Hapus
    todoList.addEventListener("click", (e) => {
        const target = e.target;

        const index = target.dataset.index;

        if (index === undefined) return;

        const tasks = getTasks();
        const taskIndex = Number(index);

        // Tandai tugas selesai atau batalkan
        if (target.classList.contains("complete-btn")) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;

            saveTasks(tasks);
            renderTasks();
        }

        // Hapus tugas dengan konfirmasi
        else if (target.classList.contains("delete-btn")) {
            const yakin = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            if (yakin) {
                tasks.splice(taskIndex, 1);

                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // 7. Bersihkan semua tugas yang sudah selesai
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        const completed = tasks.filter(task => task.completed);

        // Periksa apakah ada tugas selesai
        if (completed.length === 0) {
            alert("Tidak ada tugas selesai untuk dibersihkan.");
            return;
        }

        // Konfirmasi sebelum membersihkan
        const yakin = confirm(
            "Apakah Anda yakin ingin membersihkan semua tugas yang selesai?"
        );

        if (yakin) {
            const remainingTasks = tasks.filter(
                task => !task.completed
            );

            saveTasks(remainingTasks);
            renderTasks();

            alert("Semua tugas selesai berhasil dibersihkan!");
        }
    });

    // 8. Tampilkan daftar tugas saat halaman dibuka
    renderTasks();
});