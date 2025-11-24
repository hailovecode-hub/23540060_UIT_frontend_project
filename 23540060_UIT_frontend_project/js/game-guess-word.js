    // Logout
            function logout() {
                localStorage.removeItem('user');
                alert('Đăng xuất thành công!');
                window.location.href = '../../index.html';
            }

            const levelSelectionDiv = document.getElementById('level-selection');
            const gameContainerDiv = document.getElementById('game-container');
            const brainContainer = document.getElementById('brain-container');
            const wordInput = document.getElementById('word-input');
            const guessBtn = document.getElementById('guess-btn');
            const resultMessageEl = document.getElementById('result-message');
            const historyList = document.getElementById('history-list');
            const finalScoreEl = document.getElementById('final-score');
            const hintTextEl = document.getElementById('hint-text');

            const WORD_LIST = {
                A: [{ word: "apple", hint: "Một loại trái cây" }, { word: "house", hint: "Nơi để ở" }],
                B: [{ word: "technology", hint: "Lĩnh vực về máy móc, kỹ thuật" }, { word: "environment", hint: "Môi trường xung quanh ta" }],
                C: [{ word: "philosophy", hint: "Triết học" }, { word: "ubiquitous", hint: "Phổ biến, ở mọi nơi" }]
            };
            const GUESS_LIMITS = { A: 20, B: 50, C: 100 };

            let SECRET_WORD = "", SECRET_HINT = "", maxGuesses = 0, isGameOver = false, guessCount = 0;

            const dynamicStyleSheet = (() => { const style = document.createElement("style"); document.head.appendChild(style); return style.sheet; })();

            document.querySelectorAll('.level-btn').forEach(button => {
                button.addEventListener('click', () => startGame(button.getAttribute('data-level')));
            });

            function startGame(level) {
                levelSelectionDiv.classList.add('hidden');
                gameContainerDiv.classList.remove('hidden');
                isGameOver = false; guessCount = 0;
                historyList.innerHTML = ''; resultMessageEl.textContent = ''; finalScoreEl.textContent = '';
                wordInput.disabled = false; guessBtn.disabled = false;
                document.querySelectorAll('.neuron, .connection-line').forEach(el => el.remove());

                maxGuesses = GUESS_LIMITS[level];
                const levelWords = WORD_LIST[level];
                const { word, hint } = levelWords[Math.floor(Math.random() * levelWords.length)];
                SECRET_WORD = word; SECRET_HINT = hint;

                document.getElementById('game-title').textContent = `Đoán Từ Cấp Độ ${level}`;
                hintTextEl.textContent = SECRET_HINT;
                updateGuessProgress();
                wordInput.focus();
            }

            function handleGuess() {
                if (isGameOver) return;
                const word = wordInput.value.trim().toLowerCase();
                if (!word) return;

                playSound('guess-sound');
                guessCount++;
                updateGuessProgress();

                const similarity = calculateSimilarity(word, SECRET_WORD);

                if (word === SECRET_WORD) {
                    updateHistory(word, 1.0);
                    handleGameOver(true); return;
                }

                createNeuron(word, similarity);
                updateHistory(word, similarity);
                wordInput.value = ""; wordInput.focus();
                resultMessageEl.textContent = `Hãy thử lại...`;
                resultMessageEl.style.color = '#f59e0b';
                triggerEffect(wordInput, 'shake-effect');

                if (guessCount >= maxGuesses) handleGameOver(false);
            }

            function handleGameOver(isWin) {
                isGameOver = true;
                wordInput.disabled = true;
                guessBtn.disabled = true;

                if (isWin) {
                    playSound('win-sound');
                    const score = maxGuesses - guessCount;
                    resultMessageEl.innerHTML = `CHÍNH XÁC! Từ bí ẩn là <strong>"${SECRET_WORD}"</strong>!`;
                    resultMessageEl.style.color = 'var(--correct-color)';
                    finalScoreEl.textContent = `Điểm của bạn: ${score}`;
                } else {
                    playSound('lose-sound');
                    resultMessageEl.textContent = `Bạn đã hết lượt! Từ bí ẩn là "${SECRET_WORD}".`;
                    resultMessageEl.style.color = 'var(--root-node-color)';
                    finalScoreEl.textContent = 'Điểm của bạn: 0';
                }
            }

            function updateGuessProgress() {
                const percentage = (guessCount / maxGuesses) * 360;
                brainContainer.style.setProperty('--progress-angle', `${percentage}deg`);
            }

            function playSound(id) { const sound = document.getElementById(id); if (sound && sound.src) { sound.currentTime = 0; sound.play(); } }
            function triggerEffect(element, className) { element.classList.add(className); setTimeout(() => element.classList.remove(className), 500); }
            const getRootNodePosition = () => { const rect = brainContainer.getBoundingClientRect(); return { x: rect.width / 2, y: rect.height / 2 }; };
            function calculateSimilarity(w1, w2) { if (w1 === w2) return 1.0; const max = Math.max(w1.length, w2.length); if (max === 0) return 0; let m = 0; for (let i = 0; i < Math.min(w1.length, w2.length); i++) { if (w1[i] === w2[i]) m++; } return (m / max); }
            function calculateRadius(sim) { return 5 + ((1.0 - sim) * 40); }

            function createNeuron(word, similarity) {
                const rootPos = getRootNodePosition();
                const radius = (calculateRadius(similarity) / 100) * (brainContainer.getBoundingClientRect().width / 2 - 20);
                const angle = Math.random() * 2 * Math.PI;
                const x = rootPos.x + radius * Math.cos(angle);
                const y = rootPos.y + radius * Math.sin(angle);
                const neuronEl = document.createElement('div');
                neuronEl.className = 'neuron';
                neuronEl.style.left = `${x}px`;
                neuronEl.style.top = `${y}px`;
                neuronEl.innerHTML = `<div class="neuron-core"></div>`;
                brainContainer.appendChild(neuronEl);
                createConnection({ x, y }, rootPos);
            }

            function updateHistory(word, similarity) {
                const listItem = document.createElement('li');
                const perc = Math.round(similarity * 100);
                listItem.innerHTML = `<span>${word}</span><span style="font-weight: bold; color: ${perc < 30 ? '#ef4444' : (perc < 70 ? '#f59e0b' : '#22c55e')}">${perc}%</span>`;
                historyList.prepend(listItem);
            }

            function createConnection(neuronA, neuronB) {
                const line = document.createElement('div');
                line.className = 'connection-line';
                const dx = neuronB.x - neuronA.x; const dy = neuronB.y - neuronA.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                line.style.left = `${neuronA.x}px`; line.style.top = `${neuronA.y}px`;
                line.style.transform = `rotate(${angle}deg)`;
                const keyframes = `@keyframes draw-line-${guessCount} { to { width: ${dist}px; } }`;
                try { dynamicStyleSheet.insertRule(keyframes, dynamicStyleSheet.cssRules.length); line.style.animation = `draw-line-${guessCount} 0.8s 0.1s ease-out forwards`; } catch (e) { line.style.width = `${dist}px`; }
                brainContainer.insertBefore(line, brainContainer.children[0]);
            }

            guessBtn.addEventListener('click', handleGuess);
            wordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleGuess(); });