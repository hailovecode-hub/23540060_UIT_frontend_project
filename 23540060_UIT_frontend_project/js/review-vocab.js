// --- MOCK DATA (Giả lập dữ liệu từ Backend) ---
    const mockData = [
      {
        id: 1,
        word: "Serendipity",
        pronunciation: "/ˌser.ənˈdɪp.ə.ti/",
        meaning: "Sự tình cờ may mắn",
        example: "Finding money in my old coat was pure ___.",
        options: ["Sự xui xẻo", "Sự tình cờ may mắn", "Sự nỗ lực", "Sự thất vọng"],
        correctOption: 1 // Index của đáp án đúng
      },
      {
        id: 2,
        word: "Ephemeral",
        pronunciation: "/əˈfem.ər.əl/",
        meaning: "Phù du, sớm nở tối tàn",
        example: "Fashion trends are often ___.",
        options: ["Vĩnh cửu", "Cứng rắn", "Phù du", "Đắt đỏ"],
        correctOption: 2
      },
      {
        id: 3,
        word: "Resilient",
        pronunciation: "/rɪˈzɪl.jənt/",
        meaning: "Kiên cường, đàn hồi",
        example: "She is very ___ despite the hardships.",
        options: ["Kiên cường", "Yếu đuối", "Thờ ơ", "Vui vẻ"],
        correctOption: 0
      },
      {
        id: 4,
        word: "Eloquent",
        pronunciation: "/ˈel.ə.kwənt/",
        meaning: "Hùng hồn, có tài hùng biện",
        example: "His speech was very ___ and moving.",
        options: ["Nhút nhát", "Hùng hồn", "Im lặng", "Khó hiểu"],
        correctOption: 1
      },
      {
        id: 5,
        word: "Meticulous",
        pronunciation: "/məˈtɪk.jə.ləs/",
        meaning: "Tỉ mỉ, kỹ lưỡng",
        example: "He is ___ about keeping records.",
        options: ["Cẩu thả", "Nhanh chóng", "Lười biếng", "Tỉ mỉ"],
        correctOption: 3
      }
    ];

    let currentMode = 'flashcard';
    let currentIndex = 0;

    // --- INIT ---
    document.addEventListener('DOMContentLoaded', () => {
      renderContent();
    });

    // --- SWITCH MODE ---
    function switchMode(mode) {
      currentMode = mode;
      currentIndex = 0; // Reset về đầu khi đổi chế độ

      // Update UI buttons
      document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
      event.currentTarget.classList.add('active');

      renderContent();
    }

    // --- CORE RENDER FUNCTION ---
    function renderContent() {
      const container = document.getElementById('game-area');
      container.innerHTML = ''; // Clear old content
      updateProgress();

      if (currentIndex >= mockData.length) {
        renderCompletion(container);
        return;
      }

      const data = mockData[currentIndex];

      if (currentMode === 'flashcard') {
        renderFlashcard(container, data);
      } else if (currentMode === 'mcq') {
        renderMCQ(container, data);
      } else if (currentMode === 'fill') {
        renderFillBlank(container, data);
      }
    }

    // --- 1. FLASHCARD LOGIC ---
    function renderFlashcard(container, data) {
      const html = `
        <div class="flashcard-container">
          <div class="flashcard-inner" id="flashcard" onclick="toggleFlip()">
            <div class="flashcard-front">
              <h2>${data.word}</h2>
              <p class="pronunciation">${data.pronunciation}</p>
              <p style="color:var(--text-light); margin-top:2rem">(Click to flip)</p>
            </div>
            <div class="flashcard-back">
              <h3>${data.meaning}</h3>
              <p class="example">"${data.example.replace('___', data.word)}"</p>
              
              <div class="difficulty-buttons" onclick="event.stopPropagation()">
                <button class="diff-btn again" onclick="nextCard()">Again</button>
                <button class="diff-btn hard" onclick="nextCard()">Hard</button>
                <button class="diff-btn good" onclick="nextCard()">Good</button>
                <button class="diff-btn easy" onclick="nextCard()">Easy</button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = html;
    }

    function toggleFlip() {
      document.getElementById('flashcard').classList.toggle('flipped');
    }

    // --- 2. MCQ LOGIC ---
    function renderMCQ(container, data) {
      let optionsHtml = '';
      data.options.forEach((opt, idx) => {
        optionsHtml += `<button class="mcq-btn" onclick="checkMCQ(this, ${idx}, ${data.correctOption})">${opt}</button>`;
      });

      const html = `
        <div class="mcq-question">
          <h3>${data.word} nghĩa là gì?</h3>
          <div class="mcq-options">
            ${optionsHtml}
          </div>
          <div id="mcq-feedback" class="feedback-msg"></div>
          <button id="mcq-next" class="btn-primary" style="display:none" onclick="nextCard()">Next Word</button>
        </div>
      `;
      container.innerHTML = html;
    }

    function checkMCQ(btn, selectedIdx, correctIdx) {
      const buttons = document.querySelectorAll('.mcq-btn');
      const feedback = document.getElementById('mcq-feedback');
      const nextBtn = document.getElementById('mcq-next');

      // Disable all buttons
      buttons.forEach(b => b.classList.add('disabled'));

      if (selectedIdx === correctIdx) {
        btn.classList.add('correct');
        feedback.textContent = "Chính xác!";
        feedback.classList.add('success');
      } else {
        btn.classList.add('wrong');
        buttons[correctIdx].classList.add('correct'); // Show correct answer
        feedback.textContent = "Sai rồi!";
        feedback.classList.add('error');
      }

      nextBtn.style.display = 'inline-block';
    }

    // --- 3. FILL BLANK LOGIC ---
    function renderFillBlank(container, data) {
      // Tạo câu hỏi ẩn từ
      const sentencePart = data.example.split('___');

      const html = `
        <div class="fill-blank-question">
          <div id="fill-sentence">
            ${sentencePart[0]} ___ ${sentencePart[1] || '.'}
          </div>
          <input type="text" id="fill-input" placeholder="Type the missing word..." autocomplete="off">
          
          <div id="fill-feedback" class="feedback-msg"></div>
          
          <button id="fill-check-btn" class="btn-primary" onclick="checkFill('${data.word}')">Check Answer</button>
          <button id="fill-next-btn" class="btn-primary" style="display:none" onclick="nextCard()">Next Word</button>
        </div>
      `;
      container.innerHTML = html;

      // Add enter key support
      document.getElementById('fill-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkFill(data.word);
      });
    }

    function checkFill(correctWord) {
      const input = document.getElementById('fill-input');
      const feedback = document.getElementById('fill-feedback');
      const checkBtn = document.getElementById('fill-check-btn');
      const nextBtn = document.getElementById('fill-next-btn');

      if (input.disabled) return; // Prevent double check

      const userVal = input.value.trim().toLowerCase();
      const correctVal = correctWord.trim().toLowerCase();

      if (userVal === correctVal) {
        input.classList.add('correct');
        feedback.textContent = "Tuyệt vời! Chính xác.";
        feedback.classList.add('success');
      } else {
        input.classList.add('wrong');
        feedback.innerHTML = `Sai rồi. Đáp án đúng: <strong>${correctWord}</strong>`;
        feedback.classList.add('error');
      }

      input.disabled = true;
      checkBtn.style.display = 'none';
      nextBtn.style.display = 'inline-block';
    }

    // --- UTILS ---
    function nextCard() {
      currentIndex++;
      renderContent();
    }

    function updateProgress() {
      const percentage = Math.min(((currentIndex) / mockData.length) * 100, 100);
      document.querySelector('.progress-fill').style.width = `${percentage}%`;
      document.getElementById('progress-text').innerText = `Card ${Math.min(currentIndex + 1, mockData.length)} / ${mockData.length}`;
    }

    function renderCompletion(container) {
      container.innerHTML = `
        <div class="completion-screen">
          <h2><i class="fas fa-check-circle"></i> Hoàn thành!</h2>
          <p>Bạn đã ôn tập xong 5 từ vựng hôm nay.</p>
          <button class="btn-primary" onclick="location.reload()">Ôn tập lại</button>
        </div>
      `;
      document.querySelector('.progress-fill').style.width = `100%`;
    }
    
    // Logout
    function logout() {
      localStorage.removeItem('user');
      alert('Đăng xuất thành công!');
      window.location.href = '../../index.html';
    }