console.log("APP JS BERJALAN");
const API_URL = "http://localhost:3000/api";
const userName = document.getElementById("userName");
const token = localStorage.getItem("token");
const logoutButton = document.getElementById("logoutButton");

if (!token) {
    window.location.href = "login.html";
}
const fileContainer = document.getElementById("fileContainer");
const emptyState = document.getElementById("emptyState");
const itemCounter = document.getElementById("itemCounter");
const searchInput = document.getElementById("searchInput");
const fileInput = document.getElementById("fileInput");
const newFolderForm = document.getElementById("newFolderForm");
const folderNameInput = document.getElementById("folderName");
const renameForm = document.getElementById("renameForm");
const renameInput = document.getElementById("renameInput");
const gridViewButton = document.getElementById("gridViewButton");
const listViewButton = document.getElementById("listViewButton");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const sidebar = document.querySelector(".sidebar");

const uploadProgressContainer = document.getElementById(
    "uploadProgressContainer"
);
const uploadProgressBar = document.getElementById("uploadProgressBar");
const uploadPercentage = document.getElementById("uploadPercentage");
const uploadFileName = document.getElementById("uploadFileName");

let selectedItemId = null;

let items = []; 



function getFileType(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return "image";
    }

    if (extension === "pdf") {
        return "pdf";
    }

    if (["doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
        return "document";
    }

    return "other";
}

function getIcon(type) {
    const icons = {
        folder: "bi-folder-fill",
        image: "bi-image",
        pdf: "bi-file-earmark-pdf",
        document: "bi-file-earmark-text",
        other: "bi-file-earmark"
    };

    return icons[type] || icons.other;
}

function formatFileSize(bytes) {
    if (bytes === 0) return "0 Byte";

    const units = ["Byte", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(1)} ${units[index]}`;
}

function renderItems(keyword = "") {
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    fileContainer.innerHTML = "";

    itemCounter.textContent = `${filteredItems.length} item`;

    emptyState.classList.toggle("d-none", filteredItems.length !== 0);

    filteredItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "file-card";

        card.innerHTML = `
            <div class="file-icon ${item.type}">
                <i class="bi ${getIcon(item.type)}"></i>
            </div>

            <h3 class="file-name" title="${escapeHtml(item.name)}">
                ${escapeHtml(item.name)}
            </h3>

            <p class="file-meta">
                ${item.size ? `${item.size} • ` : ""}
                ${item.updatedAt}
            </p>

            <div class="file-menu dropdown">
    <button
        class="file-action"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        aria-label="Menu ${escapeHtml(item.name)}"
    >
        <i class="bi bi-three-dots-vertical"></i>
    </button>

    <ul class="dropdown-menu dropdown-menu-end">
        <li>
            <button
                class="dropdown-item rename-button"
                type="button"
                data-id="${item.id}"
            >
                <i class="bi bi-pencil me-2"></i>
                Ubah Nama
            </button>
        </li>

        <li>
            <button
                class="dropdown-item download-button"
                type="button"
                data-id="${item.id}"
            >
                <i class="bi bi-download me-2"></i>
                Download
            </button>
        </li>

        <li>
            <hr class="dropdown-divider">
        </li>

        <li>
            <button
                class="dropdown-item text-danger delete-button"
                type="button"
                data-id="${item.id}"
            >
                <i class="bi bi-trash me-2"></i>
                Hapus
            </button>
        </li>
    </ul>
</div>
        `;

        fileContainer.appendChild(card);
    });

    attachItemEvents();
}

function attachItemEvents() {

    // Rename
    document.querySelectorAll(".rename-button").forEach((button) => {
        button.addEventListener("click", () => {

            selectedItemId = button.dataset.id;

            const item = items.find(item => item.id == selectedItemId);

            renameInput.value = item?.name || "";

            bootstrap.Modal
                .getOrCreateInstance(document.getElementById("renameModal"))
                .show();
        });
    });

    // Delete
    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", async () => {

            const itemId = button.dataset.id;

            const item = items.find(item => item.id == itemId);

            if (!item) return;

            if (!confirm(`Hapus "${item.name}"?`)) return;

            try {

                const response = await fetch(`${API_URL}/files/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                showToast("File berhasil dihapus.");

                await loadFiles();

            } catch (err) {

                alert(err.message);

            }

        });
    });

    // Download
document.querySelectorAll(".download-button").forEach((button) => {
    button.addEventListener("click", async () => {

        const itemId = button.dataset.id;

        const response = await fetch(
            `${API_URL}/files/${itemId}/download`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        // sementara kosong saja
        a.download = "";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    });
});

}

newFolderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const folderName = folderNameInput.value.trim();

    if (!folderName) {
        folderNameInput.classList.add("is-invalid");
        return;
    }

    folderNameInput.classList.remove("is-invalid");

    items.unshift({
        id: crypto.randomUUID(),
        name: folderName,
        type: "folder",
        size: null,
        updatedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    });

    folderNameInput.value = "";

    bootstrap.Modal
        .getInstance(document.getElementById("newFolderModal"))
        .hide();

    renderItems(searchInput.value);
    showToast(`Folder "${folderName}" berhasil dibuat.`);
});

renameForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const newName = renameInput.value.trim();

    if (!newName || !selectedItemId) return;

    try {

        const response = await fetch(
            `${API_URL}/files/${selectedItemId}`,
            {

                method: "PATCH",

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    original_name: newName,
                }),

            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        bootstrap.Modal
            .getInstance(document.getElementById("renameModal"))
            .hide();

        selectedItemId = null;

        showToast("Nama file berhasil diubah.");

        await loadFiles();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

});

fileInput.addEventListener("change", async () => {

    const selectedFiles = Array.from(fileInput.files);

    for (const file of selectedFiles) {

        const formData = new FormData();

        formData.append("file", file);

        try {

            await simulateUpload(file);

            const response = await fetch(`${API_URL}/files/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

        } catch (err) {

            alert(err.message);

        }

    }

    fileInput.value = "";

    await loadFiles();

});

function simulateUpload(file) {
    return new Promise((resolve) => {
        uploadProgressContainer.classList.remove("d-none");
        uploadFileName.textContent = `Mengupload ${file.name}`;

        let progress = 0;

        const interval = setInterval(() => {
            progress += 10;

            uploadProgressBar.style.width = `${progress}%`;
            uploadPercentage.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);

                setTimeout(() => {
                    uploadProgressContainer.classList.add("d-none");
                    uploadProgressBar.style.width = "0%";
                    uploadPercentage.textContent = "0%";

                    showToast(`"${file.name}" berhasil diupload.`);
                    resolve();
                }, 350);
            }
        }, 80);
    });
}

searchInput.addEventListener("input", () => {
    renderItems(searchInput.value);
});

gridViewButton.addEventListener("click", () => {
    fileContainer.classList.remove("list-view");

    gridViewButton.classList.add("active");
    listViewButton.classList.remove("active");
});

listViewButton.addEventListener("click", () => {
    fileContainer.classList.add("list-view");

    listViewButton.classList.add("active");
    gridViewButton.classList.remove("active");
});

mobileMenuButton.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});

function showToast(message) {
    document.getElementById("toastMessage").textContent = message;

    bootstrap.Toast
        .getOrCreateInstance(document.getElementById("notificationToast"))
        .show();
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

document.addEventListener("show.bs.dropdown", (event) => {
    const fileCard = event.target.closest(".file-card");

    document.querySelectorAll(".file-card.menu-open").forEach((card) => {
        card.classList.remove("menu-open");
    });

    if (fileCard) {
        fileCard.classList.add("menu-open");
    }
});

document.addEventListener("hidden.bs.dropdown", (event) => {
    const fileCard = event.target.closest(".file-card");

    if (fileCard) {
        fileCard.classList.remove("menu-open");
    }
});
async function loadFiles() {

    console.log("LOAD FILES");

    try {

        const response = await fetch(`${API_URL}/files`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response);

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        items = data.files.map(file => ({
            id: file.id,
            name: file.original_name,
            type: getFileType(file.original_name),
            size: formatFileSize(file.file_size),
            updatedAt: new Date(file.created_at).toLocaleDateString("id-ID"),
        }));

        renderItems(searchInput.value);
    } catch (err) {

        console.error(err);

    }

}

async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("DATA PROFILE:", data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        userName.textContent = `Hi, ${data.user.name}`;

    } catch (err) {

        console.error(err);

    }

};

console.log(response);
const data = await response.json();
console.log(data);

    try {

        const response = await fetch(`http://localhost:3000/api/profile`, {            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        userName.textContent = `Hi, ${data.user.name}`;

    } catch (err) {

        console.error(err);

    }



logoutButton.addEventListener("click", () => {

    const confirmLogout = confirm("Yakin ingin logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    window.location.href = "login.html";

});

loadProfile();
loadFiles();

