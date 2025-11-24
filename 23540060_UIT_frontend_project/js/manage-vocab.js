// --- GIẢ LẬP BACKEND ---
// Bảng quy đổi từ Level (số) sang CEFR (chữ)
// Backend NÊN trả về cefrInfo (label, name) trực tiếp
const cefrMap = {
    1: { label: "A1", name: "Căn bản" },
    2: { label: "A2", name: "Sơ cấp" },
    3: { label: "B1", name: "Trung cấp" },
    4: { label: "B2", name: "Trung-Cao cấp" },
    5: { label: "C1", name: "Cao cấp" },
    6: { label: "C2", name: "Thành thạo" }
};

// Bảng màu dành cho các thanh tiến độ chủ đề
const topicColors = ['#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// --- API STUBS (Giả lập Backend) ---
// Đây là nơi thay thế bằng các lệnh gọi `fetch` thực tế
const api = {
    // Giả lập lấy dữ liệu dashboard
    getDashboardData: async () => {
        console.log("API: Fetching dashboard data...");
        await new Promise(r => setTimeout(r, 500)); // Giả lập độ trễ mạng
        // Backend sẽ trả về dữ liệu đã tính toán
        return {
            userLevel: 1, // Level số của user
            cefrLabel: "A1", // Nhãn CEFR
            cefrName: "Căn bản", // Tên CEFR
            levelProgressPercentage: 30, // % tiến độ
            wordsNeeded: 35, // Số từ cần để lên cấp
            nextLevelLabel: "A2", // Nhãn cấp tiếp theo
            topicsBreakdown: [ // Danh sách chủ đề đã tính toán
                { name: "Technology", learned: 3, total: 10 },
                { name: "Science", learned: 1, total: 5 },
                { name: "Business", learned: 5, total: 5 },
            ]
        };
    },

    // Giả lập lấy danh sách từ vựng (phân trang, lọc, tìm kiếm)
    getVocab: async ({ page, limit, filter, search }) => {
        console.log(`API: Fetching vocab (page: ${page}, limit: ${limit}, filter: ${filter}, search: '${search}')`);
        await new Promise(r => setTimeout(r, 500));
        // Backend sẽ xử lý lọc, tìm kiếm và phân trang
        // Đây là dữ liệu mẫu trả về
        const mockApiResponse = {
            items: [
                { id: 1, word: 'Algorithm', meaning: 'Thuật toán', example: 'Sorting algorithms...', exampleMeaning: '...', topic: 'Technology', level: 'B2', proficiency: 5, imageUrl: '' },
                { id: 3, word: 'Gravity', meaning: 'Trọng lực', example: 'Gravity keeps...', exampleMeaning: '...', topic: 'Science', level: 'B1', proficiency: 4, imageUrl: '' },
            ],
            totalPages: 3, // Backend tính toán tổng số trang
            totalCount: 15 // Backend tính toán tổng số từ
        };
        return mockApiResponse;
    },

    // Giả lập lấy danh sách chủ đề
    getTopics: async () => {
        console.log("API: Fetching topics...");
        await new Promise(r => setTimeout(r, 300));
        return ['All', 'Technology', 'Science', 'Business', 'Politics'];
    },

    // Giả lập lấy chi tiết 1 từ
    getWord: async (id) => {
        console.log(`API: Fetching word (id: ${id})`);
        await new Promise(r => setTimeout(r, 300));
        // Dữ liệu mẫu
        return { id: id, word: 'Algorithm', meaning: 'Thuật toán', example: 'Sorting algorithms are used to arrange data.', exampleMeaning: 'Các thuật toán sắp xếp được dùng để sắp xếp dữ liệu.', topic: 'Technology', level: 'B2', proficiency: 5, imageUrl: '' };
    },

    // Giả lập thêm từ mới
    addWord: async (wordData) => {
        console.log("API: Adding new word...", wordData);
        await new Promise(r => setTimeout(r, 500));
        return { ...wordData, id: Math.floor(Math.random() * 1000) + 100 }; // Trả về từ đã tạo
    },

    // Giả lập cập nhật từ
    updateWord: async (id, wordData) => {
        console.log(`API: Updating word (id: ${id})...`, wordData);
        await new Promise(r => setTimeout(r, 500));
        return { ...wordData, id: id }; // Trả về từ đã cập nhật
    },

    // Giả lập xóa từ
    deleteWord: async (id) => {
        console.log(`API: Deleting word (id: ${id})...`);
        await new Promise(r => setTimeout(r, 500));
        return { success: true };
    }
};
// --- KẾT THÚC API STUBS ---

// --- HÀM CẬP NHẬT GIAO DIỆN DASHBOARD ---
// Hàm này giờ đây nhận dữ liệu đã được tính toán từ backend
function updateDashboard(data) {
    const levelProgressCircle = document.getElementById('level-progress-circle');
    const levelDisplay = document.getElementById('level-display');
    const wordsToNextLevelEl = document.getElementById('words-to-next-level');
    const topicBreakdownContainer = document.getElementById('topic-breakdown');

    // 1. Cập nhật biểu đồ tròn (nhận dữ liệu trực tiếp)
    //     Kỹ thuật Chính: conic-gradient (Gradient hình nón)
    // Đây là một hàm CSS dùng để tạo hiệu ứng biểu đồ tròn bằng cách đổ màu xung quanh tâm.
    // Biểu đồ này được áp dụng cho thuộc tính background của phần tử levelProgressCircle
    //var(--accent-gold) ${Góc}deg: Phần này chỉ định màu sắc (vàng kim) được tô từ 0 độ đến góc tính toán. Đây là phần tiến độ đã đạt được.
    levelDisplay.innerHTML = `<div class="cefr-label">${data.cefrLabel}</div><div class="cefr-name">${data.cefrName}</div>`;

    setTimeout(() => {
        levelProgressCircle.style.background = `conic-gradient(var(--accent-gold) ${data.levelProgressPercentage * 3.6}deg, var(--progress-bg) 0deg)`;
    }, 100);

    // 2. Cập nhật thông tin cấp độ
    if (data.wordsNeeded > 0) {
        wordsToNextLevelEl.innerHTML = `Cần thêm <strong>${data.wordsNeeded}</strong> từ nữa để đạt <strong>${data.nextLevelLabel}</strong>`;
    } else {
        wordsToNextLevelEl.innerHTML = `🎉 <strong>Chúc mừng!</strong> Bạn đã đủ điều kiện lên cấp!`;
    }

    // 3. Cập nhật các thanh tiến độ theo chủ đề (nhận danh sách đã tính toán)
    topicBreakdownContainer.innerHTML = '';
    data.topicsBreakdown.forEach((topic, index) => {
        const topicPercentage = topic.total > 0 ? (topic.learned / topic.total) * 100 : 0;
        const barColor = topicColors[index % topicColors.length];
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.innerHTML = `
                <div class="topic-header">
                    <span class="topic-name">${topic.name}</span>
                    <span class="topic-count">${topic.learned} / ${topic.total}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill"></div>
                </div>`;
        topicBreakdownContainer.appendChild(topicItem);
        setTimeout(() => {
            const progressBarFill = topicItem.querySelector('.progress-bar-fill');
            progressBarFill.style.width = `${topicPercentage}%`;
            progressBarFill.style.background = barColor;
        }, 100);
    });
}
// KẾT THÚC DASHBOARD ====================================================

// --- LOGIC BẢNG TỪ VỰNG ---
document.addEventListener('DOMContentLoaded', function () {

    // --- TRẠNG THÁI CỦA CLIENT ---
    let currentPage = 1;
    const rowsPerPage = 5;
    let currentFilter = 'All';
    let searchQuery = '';
    let wordIdToDelete = null; // Dùng cho modal xác nhận xóa
    let searchTimeout = null; // Dùng cho debounce

    // --- DOM Elements ---
    const tableBody = document.getElementById('vocab-table');
    const paginationContainer = document.getElementById('pagination');
    const topicFilterButtonsContainer = document.getElementById('topic-filter-buttons');
    const searchInput = document.getElementById('search-input');
    const addWordModal = document.getElementById('addWordModal');
    const editWordModal = document.getElementById('editWordModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const addWordForm = document.getElementById('addWordForm');
    const editWordForm = document.getElementById('editWordForm');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // --- HÀM TẢI DỮ LIỆU TỪ API ---

    // Tải và hiển thị dữ liệu Dashboard
    async function loadDashboardData() {
        try {
            // Hiển thị trạng thái tải (nếu cần)
            document.getElementById('words-to-next-level').innerHTML = 'Đang tải...';
            document.getElementById('topic-breakdown').innerHTML = '';

            const dashboardData = await api.getDashboardData(); // Gọi API
            updateDashboard(dashboardData); // Cập nhật UI
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            document.getElementById('words-to-next-level').innerHTML = 'Lỗi tải dữ liệu.';
        }
    }

    // Tải và hiển thị danh sách chủ đề
    async function loadTopicFilters() {
        try {
            const topics = await api.getTopics(); // Gọi API
            populateTopicFilterButtons(topics); // Cập nhật UI
        } catch (error) {
            console.error("Failed to load topics:", error);
            topicFilterButtonsContainer.innerHTML = 'Lỗi tải chủ đề.';
        }
    }

    // Tải và hiển thị bảng từ vựng (chính)
    async function loadPageData() {
        try {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 32px 0;">Đang tải từ vựng...</td></tr>`;
            paginationContainer.innerHTML = '';

            const params = {
                page: currentPage,
                limit: rowsPerPage,
                filter: currentFilter,
                search: searchQuery
            };
            const response = await api.getVocab(params); // Gọi API

            renderTable(response.items);
            renderPagination(response.totalPages);
        } catch (error) {
            console.error("Failed to load vocab data:", error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 32px 0;">Lỗi tải dữ liệu. Vui lòng thử lại.</td></tr>`;
        }
    }

    // --- HÀM HIỂN THỊ (Render) ---

    // Hàm render thanh thông thạo (đây là logic hiển thị)
    function renderProficiency(level) {
        let barHTML = '<div class="proficiency-bar" title="Mức độ ' + level + '/5">';
        for (let i = 1; i <= 5; i++) {
            let filledClass = (i <= level) ? `filled level-${i}` : '';
            barHTML += `<div class="proficiency-level ${filledClass}"></div>`;
        }
        barHTML += '</div>';
        return barHTML;
    }

    // Render bảng với dữ liệu (items) từ API
    function renderTable(items) {
        tableBody.innerHTML = '';

        if (!items || items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 32px 0;">Không tìm thấy từ vựng nào.</td></tr>`;
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            // Gắn ID vào dataset để dễ truy xuất
            row.dataset.id = item.id;
            row.innerHTML = `
                    <td class="word-cell">
                        <p class="word">${item.word}</p>
                        ${item.example ? `<p class="example">"${item.example}"</p>` : ''}
                    </td>
                    <td>${item.meaning}</td>
                    <td><span class="tag tag-topic">${item.topic}</span></td>
                    <td><span class="tag tag-level">${item.level}</span></td>
                    <td class="text-center">${renderProficiency(item.proficiency)}</td>
                    <td class="text-center">
                        <button onclick="handleEditWord(${item.id})" class="action-btn action-btn-edit" title="Sửa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onclick="handleDeleteWord(${item.id})" class="action-btn action-btn-delete" title="Xóa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </td>
                `;
            tableBody.appendChild(row);
        });
    }

    // Render phân trang dựa trên tổng số trang (totalPages) từ API
    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.innerHTML = `&laquo;`;
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadPageData(); // Gọi API
            }
        };
        paginationContainer.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = `&raquo;`;
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadPageData(); // Gọi API
            }
        };
        paginationContainer.appendChild(nextButton);
    }

    // Render nút lọc chủ đề (topics) từ API
    function populateTopicFilterButtons(topics) {
        topicFilterButtonsContainer.innerHTML = '';
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.textContent = topic;
            button.className = 'filter-btn';
            if (currentFilter === topic) {
                button.classList.add('active');
            }
            button.onclick = () => {
                currentFilter = topic;
                currentPage = 1; // Reset về trang 1
                populateTopicFilterButtons(topics); // Cập nhật lại UI nút
                loadPageData(); // Gọi API
            };
            topicFilterButtonsContainer.appendChild(button);
        });
    }

    // --- Modal Handling (Giữ nguyên) ---
    window.showAddWordModal = () => { addWordModal.classList.add('show'); };
    window.closeAddWordModal = () => { addWordModal.classList.remove('show'); };
    window.showEditWordModal = () => { editWordModal.classList.add('show'); };
    window.closeEditWordModal = () => { editWordModal.classList.remove('show'); };

    const closeConfirmDeleteModal = () => {
        wordIdToDelete = null;
        confirmDeleteModal.classList.remove('show');
    };

    addWordModal.addEventListener('click', closeAddWordModal);
    editWordModal.addEventListener('click', closeEditWordModal);
    confirmDeleteModal.addEventListener('click', closeConfirmDeleteModal);

    // Hàm debounce
    function debounce(func, delay) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(func, delay);
    }

    // --- EVENT LISTENERS ---

    // Tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debounce(() => {
            searchQuery = query;
            currentPage = 1; // Reset về trang 1
            loadPageData(); // Gọi API
        }, 500); // Chờ 500ms sau khi người dùng ngừng gõ
    });

    // Submit form Thêm mới
    addWordForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const newWord = {
            word: document.getElementById('wordInput').value,
            meaning: document.getElementById('meaningInput').value,
            example: document.getElementById('exampleInput').value,
            exampleMeaning: document.getElementById('exampleMeaningInput').value,
            topic: document.getElementById('topicInput').value,
            level: document.getElementById('levelInput').value,
            proficiency: parseInt(document.getElementById('proficiencyInput').value),
            imageUrl: document.getElementById('imageUrlInput').value,
        };

        try {
            // (Hiển thị loading)
            await api.addWord(newWord); // Gọi API
            addWordForm.reset();
            closeAddWordModal();
            refreshData(); // Tải lại tất cả dữ liệu
        } catch (error) {
            console.error("Failed to add word:", error);
            alert("Thêm từ thất bại, vui lòng thử lại.");
        }
    });

    // Submit form Chỉnh sửa
    editWordForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editWordId').value);
        if (!id) return;

        const updatedWord = {
            word: document.getElementById('editWordInput').value,
            meaning: document.getElementById('editMeaningInput').value,
            example: document.getElementById('editExampleInput').value,
            exampleMeaning: document.getElementById('editExampleMeaningInput').value,
            topic: document.getElementById('editTopicInput').value,
            level: document.getElementById('editLevelInput').value,
            proficiency: parseInt(document.getElementById('editProficiencyInput').value),
            imageUrl: document.getElementById('editImageUrlInput').value,
        };

        try {
            await api.updateWord(id, updatedWord); // Gọi API
            closeEditWordModal();
            refreshData(); // Tải lại tất cả dữ liệu
        } catch (error) {
            console.error("Failed to update word:", error);
            alert("Cập nhật từ thất bại, vui lòng thử lại.");
        }
    });

    // Xác nhận Xóa
    cancelDeleteBtn.addEventListener('click', closeConfirmDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (wordIdToDelete === null) return;

        try {
            await api.deleteWord(wordIdToDelete); // Gọi API
            closeConfirmDeleteModal();
            refreshData(); // Tải lại tất cả dữ liệu
        } catch (error) {
            console.error("Failed to delete word:", error);
            alert("Xóa từ thất bại, vui lòng thử lại.");
        }
    });

    // --- HÀNH ĐỘNG TRÊN BẢNG (Gắn vào global window) ---

    // Xử lý khi nhấn nút Sửa
    window.handleEditWord = async function (id) {
        try {
            const item = await api.getWord(id); // Gọi API lấy chi tiết
            if (!item) {
                alert("Không tìm thấy từ.");
                return;
            }
            // Điền dữ liệu vào form
            document.getElementById('editWordId').value = item.id;
            document.getElementById('editWordInput').value = item.word;
            document.getElementById('editMeaningInput').value = item.meaning;
            document.getElementById('editExampleInput').value = item.example || '';
            document.getElementById('editExampleMeaningInput').value = item.exampleMeaning || '';
            document.getElementById('editTopicInput').value = item.topic;
            document.getElementById('editLevelInput').value = item.level;
            document.getElementById('editImageUrlInput').value = item.imageUrl || '';
            document.getElementById('editProficiencyInput').value = item.proficiency;
            showEditWordModal();
        } catch (error) {
            console.error("Failed to get word details:", error);
            alert("Lỗi khi lấy thông tin từ, vui lòng thử lại.");
        }
    }

    // Xử lý khi nhấn nút Xóa
    window.handleDeleteWord = async function (id) {
        try {
            const item = await api.getWord(id); // Lấy tên từ để hiển thị
            if (!item) {
                alert("Không tìm thấy từ.");
                return;
            }
            wordIdToDelete = id;
            document.getElementById('confirm-delete-text').innerHTML = `Bạn có chắc chắn muốn xóa từ: "<strong>${item.word}</strong>"?`;
            confirmDeleteModal.classList.add('show');
        } catch (error) {
            console.error("Failed to get word details:", error);
            alert("Lỗi khi lấy thông tin từ, vui lòng thử lại.");
        }
    }

    // --- HÀM KHỞI TẠO ---

    // Tải lại toàn bộ dữ liệu (sau khi CUD)
    function refreshData() {
        // Tải lại bảng (sẽ ở trang hiện tại, nhưng có thể cần về trang 1 nếu logic xóa yêu cầu)
        // Tốt nhất là tải lại cả 3 để đồng bộ
        loadDashboardData();
        loadTopicFilters();
        loadPageData();
    }

    // Khởi chạy ứng dụng
    function initializeApp() {
        loadDashboardData();
        loadTopicFilters();
        loadPageData();
    }

    // --- INITIAL RENDER ---
    initializeApp();
});
