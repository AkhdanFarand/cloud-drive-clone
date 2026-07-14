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

let items = [
    {
        id: crypto.randomUUID(),
        name: "Dokumen Kuliah",
        type: "folder",
        size: null,
        updatedAt: "14 Juli 2026"
    },
    {
        id: crypto.randomUUID(),
        name: "Foto",
        type: "folder",
        size: null,
        updatedAt: "13 Juli 2026"
    },
    {
        id: crypto.randomUUID(),
        name: "Proposal UAS.pdf",
        type: "pdf",
        size: "2.4 MB",
        updatedAt: "12 Juli 2026"
    },
    {
        id: crypto.randomUUID(),
        name: "Diagram Arsitektur.png",
        type: "image",
        size: "1.1 MB",
        updatedAt: "11 Juli 2026"
    },
    {
        id: crypto.randomUUID(),
        name: "Catatan Project.docx",
        type: "document",
        size: "750 KB",
        updatedAt: "10 Juli 2026"
    }
];

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
    document.querySelectorAll(".rename-button").forEach((button) => {
        button.addEventListener("click", () => {
            selectedItemId = button.dataset.id;

            const item = items.find(
                (currentItem) => currentItem.id === selectedItemId
            );

            renameInput.value = item?.name || "";

            bootstrap.Modal
                .getOrCreateInstance(document.getElementById("renameModal"))
                .show();
        });
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", () => {
            const itemId = button.dataset.id;
            const item = items.find((currentItem) => currentItem.id === itemId);

            if (!item) return;

            const isConfirmed = confirm(
                `Hapus "${item.name}" dari penyimpanan?`
            );

            if (!isConfirmed) return;

            items = items.filter(
                (currentItem) => currentItem.id !== itemId
            );

            renderItems(searchInput.value);
            showToast(`"${item.name}" berhasil dihapus.`);
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

renameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newName = renameInput.value.trim();

    if (!newName || !selectedItemId) return;

    const item = items.find(
        (currentItem) => currentItem.id === selectedItemId
    );

    if (!item) return;

    item.name = newName;

    bootstrap.Modal
        .getInstance(document.getElementById("renameModal"))
        .hide();

    renderItems(searchInput.value);
    showToast("Nama berhasil diperbarui.");

    selectedItemId = null;
});

fileInput.addEventListener("change", async () => {
    const selectedFiles = Array.from(fileInput.files);

    for (const file of selectedFiles) {
        await simulateUpload(file);

        items.unshift({
            id: crypto.randomUUID(),
            name: file.name,
            type: getFileType(file.name),
            size: formatFileSize(file.size),
            updatedAt: new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        });

        renderItems(searchInput.value);
    }

    fileInput.value = "";
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
renderItems();