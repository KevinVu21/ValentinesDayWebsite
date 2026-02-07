/* ----------------------------
   SCREEN FLOW
---------------------------- */

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  setTimeout(() => showScreen('start'), 1500);
  
  function goToIntro() {
    showScreen('intro');
  }
  
  function startGame() {
    loadLevel1();
  }
  
  /* ----------------------------
     PROGRESS DOTS
  ---------------------------- */
  function progressDots(levelIndex) {
    let dots = '';
    for (let i = 0; i < 5; i++) dots += `<span class="${i <= levelIndex ? 'active' : ''}"></span>`;
    return `<div class="progress">${dots}</div>`;
  }
  
  /* ----------------------------
     ✅ HEART PARTICLES
  ---------------------------- */
  const HEARTS = ["💗","💖","💕","💘","💞","💝"];
  
  function burstHeartsAt(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "heart-particle";
      el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  
      const dx = (Math.random() - 0.5) * 90;          // side drift
      const dy = 60 + Math.random() * 70;             // rise
      const s = 0.9 + Math.random() * 0.9;            // scale
      const dur = 750 + Math.random() * 450;          // duration
  
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);
      el.style.setProperty("--s", `${s}`);
      el.style.setProperty("--dur", `${dur}ms`);
  
      document.body.appendChild(el);
  
      setTimeout(() => el.remove(), dur + 80);
    }
  }
  
  function burstHeartsAtElement(el, count = 12) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    burstHeartsAt(x, y, count);
  }
  
  /* ----------------------------
     BUTTON FLASH FEEDBACK
  ---------------------------- */
  function flash(btn, type) {
    if (!btn) return;
    btn.classList.remove('flash-wrong', 'flash-correct');
    void btn.offsetWidth;
    btn.classList.add(type);
  }
  
  function wireChoiceButtons(nextFn) {
    document.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          flash(btn, 'flash-correct');
          burstHeartsAtElement(btn, 14);
          setTimeout(() => nextFn(), 550);
        } else {
          flash(btn, 'flash-wrong');
        }
      });
    });
  }
  
  /* ----------------------------
     LEVEL 1 — MATCHING HEARTS
  ---------------------------- */
  function loadLevel1() {
    showScreen('game');
  
    const pairs = ['💖','💘','💕','💗','💓','💞','💝','💟','❤️‍🔥','❤️‍🩹'];
    const tiles = pairs.concat(pairs);
  
    const cols = 4;
    const layout = shuffleNoAdjacent(tiles, cols);
  
    let first = null;
    let lock = false;
    let matchedCount = 0;
  
    document.getElementById('game').innerHTML = `
      <div class="card fade-in" id="lvl1Card">
        ${progressDots(0)}
        <h2>💝 Level 1: Match the Hearts 💝</h2>
        <p>Match all the hearts to continue</p>
        <p class="small-note">Tip: they won’t be next to their match 😉</p>
        <div class="grid" id="grid"></div>
      </div>
    `;
  
    const grid = document.getElementById('grid');
    const card = document.getElementById('lvl1Card');
  
    layout.forEach((emoji) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.emoji = emoji;
      tile.textContent = '';
  
      tile.onclick = () => {
        if (lock) return;
        if (tile.classList.contains('matched')) return;
        if (tile === first) return;
  
        tile.textContent = emoji;
  
        if (!first) {
          first = tile;
          return;
        }
  
        lock = true;
  
        if (first.dataset.emoji === tile.dataset.emoji) {
          first.classList.add('matched');
          tile.classList.add('matched');
          matchedCount += 2;
  
          resetPick();
  
          if (matchedCount === tiles.length) {
            // cute hearts when level completes
            burstHeartsAtElement(card, 22);
            setTimeout(trivia1, 650);
          }
        } else {
          setTimeout(() => {
            first.textContent = '';
            tile.textContent = '';
            resetPick();
          }, 750);
        }
      };
  
      grid.appendChild(tile);
    });
  
    function resetPick() {
      first = null;
      lock = false;
    }
  }
  
  function shuffleNoAdjacent(arr, cols) {
    const maxTries = 2500;
    let best = null;
  
    for (let t = 0; t < maxTries; t++) {
      const attempt = [...arr].sort(() => Math.random() - 0.5);
      if (isValidNoAdjacent(attempt, cols)) return attempt;
      best = attempt;
    }
    return best ?? [...arr];
  }
  
  function isValidNoAdjacent(list, cols) {
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      const inSameRow = (i % cols) !== (cols - 1);
      if (inSameRow && list[i + 1] === e) return false;
      const below = i + cols;
      if (below < list.length && list[below] === e) return false;
    }
    return true;
  }
  
  /* ----------------------------
     TRIVIA 1 -> LEVEL 2
  ---------------------------- */
  function trivia1() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(0)}
        <h2>💖 Trivia 💖</h2>
        <p>Where did we go first on our first date?</p>
  
        <button class="main-btn" data-choice="true" data-correct="false">🎬 Movie theater</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍔 Burger place</button><br>
        <button class="main-btn" data-choice="true" data-correct="true">🌮 Taco truck</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍦 Ice cream shop</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍜 Ramen spot</button>
      </div>
    `;
    wireChoiceButtons(loadLevel2);
  }
  
  /* ----------------------------
     LEVEL 2 — THIS OR THAT (Pizza correct)
  ---------------------------- */
  function loadLevel2() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(1)}
        <h2>💕 Level 2: This or That 💕</h2>
        <p>Which do I love more?</p>
  
        <button class="main-btn" data-choice="true" data-correct="false">🌮 Tacos</button><br>
        <button class="main-btn" data-choice="true" data-correct="true">🍕 Pizza</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍣 Sushi</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍗 Fried chicken</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍝 Pasta</button>
      </div>
    `;
    wireChoiceButtons(trivia2);
  }
  
  /* ----------------------------
     TRIVIA 2 -> LEVEL 3
  ---------------------------- */
  function trivia2() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(1)}
        <h2>💗 Trivia 💗</h2>
        <p>What dessert did we get on our first date?</p>
  
        <button class="main-btn" data-choice="true" data-correct="false">🍩 Donuts</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍦 Ice cream</button><br>
        <button class="main-btn" data-choice="true" data-correct="true">🥭 Mango dessert</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍰 Cake</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍪 Cookies</button>
      </div>
    `;
    wireChoiceButtons(loadLevel3);
  }
  
  /* ----------------------------
     LEVEL 3 — ORDER OUR DATE
  ---------------------------- */
  function loadLevel3() {
    const expected = ["🌮 Taco truck", "🚗 Drive", "🥭 Mango dessert", "🕹️ Claw machines"];
    let idx = 0;
    let chosen = [];
  
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(2)}
        <h2>💞 Level 3: Put the Date in Order 💞</h2>
        <p>Tap them in the correct order</p>
  
        <div class="order-row">
          <button class="main-btn" style="width:100%" id="b0">${expected[0]}</button>
          <button class="main-btn" style="width:100%" id="b1">${expected[2]}</button>
          <button class="main-btn" style="width:100%" id="b2">${expected[3]}</button>
          <button class="main-btn" style="width:100%" id="b3">${expected[1]}</button>
        </div>
  
        <div class="order-display" id="orderDisplay">Your order: (tap above)</div>
        <p class="small-note">If you mess up, it resets 💗</p>
      </div>
    `;
  
    const buttons = [
      document.getElementById("b0"),
      document.getElementById("b1"),
      document.getElementById("b2"),
      document.getElementById("b3"),
    ];
  
    const display = document.getElementById("orderDisplay");
  
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.textContent;
  
        if (val === expected[idx]) {
          flash(btn, "flash-correct");
          burstHeartsAtElement(btn, 10);
          chosen.push(val);
          idx++;
          display.textContent = `Your order: ${chosen.join(" → ")}`;
  
          if (idx === expected.length) {
            setTimeout(trivia3, 650);
          }
        } else {
          flash(btn, "flash-wrong");
          idx = 0;
          chosen = [];
          setTimeout(() => { display.textContent = "Your order: (tap above)"; }, 350);
        }
      });
    });
  }
  
  /* ----------------------------
     TRIVIA 3 -> LEVEL 4
  ---------------------------- */
  function trivia3() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(2)}
        <h2>💖 Trivia 💖</h2>
        <p>What almost happened on the way to the dessert place?</p>
  
        <button class="main-btn" data-choice="true" data-correct="false">🚗 I almost crashed</button><br>
        <button class="main-btn" data-choice="true" data-correct="true">🚗 Jackie almost crashed</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🚓 We got pulled over</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">⛽ We ran out of gas</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🌧️ It started raining</button>
      </div>
    `;
    wireChoiceButtons(loadLevel4);
  }
  
  /* ----------------------------
     LEVEL 4 — SPELL THE WORD
  ---------------------------- */
  function loadLevel4() {
    const target = "MANGO";
    const letters = shuffleArray(target.split(""));
  
    let built = "";
    let used = [];
  
    document.getElementById('game').innerHTML = `
      <div class="card fade-in" id="lvl4Card">
        ${progressDots(3)}
        <h2>💝 Level 4: Spell the Word 💝</h2>
        <p>Tap the letters to spell a word from our date</p>
  
        <div class="spell-display" id="spellDisplay">_ _ _ _ _</div>
        <div class="letter-row" id="letterRow"></div>
  
        <button class="main-btn" id="resetBtn">Reset</button>
        <p class="small-note">Hint: 🥭</p>
      </div>
    `;
  
    const card = document.getElementById("lvl4Card");
    const display = document.getElementById("spellDisplay");
    const row = document.getElementById("letterRow");
    const resetBtn = document.getElementById("resetBtn");
  
    letters.forEach((ch) => {
      const btn = document.createElement("button");
      btn.className = "letter-btn";
      btn.textContent = ch;
  
      btn.addEventListener("click", () => {
        btn.disabled = true;
        used.push(btn);
        built += ch;
        display.textContent = built.split("").join(" ");
  
        if (built.length === target.length) {
          if (built === target) {
            burstHeartsAtElement(card, 22);
            setTimeout(trivia4, 650);
          } else {
            used.forEach(b => b.classList.add("flash-wrong"));
            setTimeout(reset, 550);
          }
        }
      });
  
      row.appendChild(btn);
    });
  
    resetBtn.addEventListener("click", reset);
  
    function reset() {
      built = "";
      display.textContent = "_ _ _ _ _";
      used.forEach(b => {
        b.disabled = false;
        b.classList.remove("flash-wrong", "flash-correct");
      });
      used = [];
    }
  }
  
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  /* ----------------------------
     TRIVIA 4 -> LEVEL 5
  ---------------------------- */
  function trivia4() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(3)}
        <h2>💗 Trivia 💗</h2>
        <p>What place did we go after the mango dessert?</p>
  
        <button class="main-btn" data-choice="true" data-correct="false">🎳 Bowling</button><br>
        <button class="main-btn" data-choice="true" data-correct="true">🕹️ Claw machines</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🎥 Movie</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🍦 Another dessert</button><br>
        <button class="main-btn" data-choice="true" data-correct="false">🏠 Home</button>
      </div>
    `;
    wireChoiceButtons(loadLevel5);
  }
  
  /* ----------------------------
     LEVEL 5 — LOVE CHECKLIST
  ---------------------------- */
  function loadLevel5() {
    document.getElementById('game').innerHTML = `
      <div class="card fade-in">
        ${progressDots(4)}
        <h2>💘 Level 5: Choose all that apply 💘</h2>
        <p>Things I love about you…</p>
  
        <div class="checklist" id="checklist">
          <label class="check-item"><input type="checkbox" /> Your smile 😊</label>
          <label class="check-item"><input type="checkbox" /> Your laugh 🥰</label>
          <label class="check-item"><input type="checkbox" /> Your heart 💖</label>
          <label class="check-item"><input type="checkbox" /> Everything about you 💘</label>
        </div>
  
        <button class="main-btn" id="revealBtn" disabled>Reveal the secret 💌</button>
        <p class="small-note">No wrong answers here 😌</p>
      </div>
    `;
  
    const checks = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]'));
    const revealBtn = document.getElementById("revealBtn");
  
    function update() {
      revealBtn.disabled = !checks.every(c => c.checked);
    }
    checks.forEach(c => c.addEventListener("change", update));
  
    revealBtn.addEventListener("click", () => {
      flash(revealBtn, "flash-correct");
      burstHeartsAtElement(revealBtn, 18);
      setTimeout(finalRevealSequence, 450);
    });
  }
  
  /* ----------------------------
     FINAL REVEAL SEQUENCE
  ---------------------------- */
  function finalRevealSequence() {
    const game = document.getElementById('game');
  
    game.innerHTML = `
      <div class="card fade-in" id="madeItCard">
        ${progressDots(4)}
        <h2>You made it... 💖</h2>
        <p>One last thing before the secret message…</p>
      </div>
    `;
  
    setTimeout(() => {
      const card = document.getElementById('madeItCard');
      if (!card) return;
      card.classList.remove('fade-in');
      card.classList.add('fade-out');
      setTimeout(showEnvelope, 900);
    }, 1400);
  }
  
  function showEnvelope() {
    const game = document.getElementById('game');
  
    game.innerHTML = `
      <div class="card pop-in">
        ${progressDots(4)}
        <h2>Click the envelope 💌</h2>
        <p class="small-note">Open it to reveal the message</p>
  
        <div class="envelope-wrap">
          <div class="envelope" id="envelope">
            <div class="base"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="bottom"></div>
            <div class="paper">For Jackie 💖</div>
            <div class="flap"></div>
            <div class="seal">❤</div>
          </div>
        </div>
      </div>
    `;
  
    const env = document.getElementById('envelope');
    env.addEventListener('click', () => {
      env.classList.add('open');
      burstHeartsAtElement(env, 16);
      setTimeout(showValentineQuestion, 900);
    }, { once: true });
  }
  
  /* ----------------------------
     PLAYFUL BUT IMPOSSIBLE "NO"
  ---------------------------- */
  let noTracker = null;
  let noAnim = null;
  
  function showValentineQuestion() {
    const game = document.getElementById('game');
    cleanupNo();
  
    game.innerHTML = `
      <div class="card fade-in" id="questionCard">
        ${progressDots(4)}
        <h2>Jackie… 💖</h2>
        <p>Will you be my Valentine? 💌</p>
  
        <div class="choices">
          <button class="main-btn" id="yesBtn">YES 💕</button>
        </div>
  
        <p class="small-note">Choose wisely 😌</p>
      </div>
  
      <button class="main-btn no-btn" id="noBtn">No 😢</button>
    `;
  
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const card = document.getElementById('questionCard');
  
    const start = initialNoPosition(noBtn, card);
  
    noAnim = {
      btn: noBtn,
      card,
      x: start.x,
      y: start.y,
      tx: start.x,
      ty: start.y,
      w: noBtn.getBoundingClientRect().width || 260,
      h: noBtn.getBoundingClientRect().height || 56,
      padding: 12,
  
      nearDist: 165,
      safeDist: 240,
      lerp: 0.22,
      maxJitter: 140
    };
  
    noBtn.style.left = `${noAnim.x}px`;
    noBtn.style.top = `${noAnim.y}px`;
  
    pickNewTargetAwayFrom({ x: -9999, y: -9999 });
  
    let running = true;
    function tick() {
      if (!running || !noAnim) return;
  
      noAnim.x = noAnim.x + (noAnim.tx - noAnim.x) * noAnim.lerp;
      noAnim.y = noAnim.y + (noAnim.ty - noAnim.y) * noAnim.lerp;
  
      clampNo(noAnim);
  
      noAnim.btn.style.left = `${noAnim.x}px`;
      noAnim.btn.style.top = `${noAnim.y}px`;
  
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  
    noTracker = (e) => {
      if (!noAnim) return;
      const mx = e.clientX;
      const my = e.clientY;
  
      const cx = noAnim.x + noAnim.w / 2;
      const cy = noAnim.y + noAnim.h / 2;
      const dist = Math.hypot(mx - cx, my - cy);
  
      if (dist < noAnim.nearDist) {
        pickNewTargetAwayFrom({ x: mx, y: my });
        noAnim.btn.style.transform = 'scale(1.02)';
        setTimeout(() => { if (noAnim) noAnim.btn.style.transform = 'scale(1)'; }, 120);
      }
    };
  
    window.addEventListener('mousemove', noTracker);
  
    yesBtn.addEventListener('click', () => {
      running = false;
      cleanupNo();
      noBtn.style.display = 'none';
      burstHeartsAtElement(yesBtn, 26);
      setTimeout(showCelebration, 400);
    });
  
    function pickNewTargetAwayFrom(mouse) {
      const cardRect = noAnim.card.getBoundingClientRect();
      const center = {
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 2
      };
  
      let best = null;
  
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 140 + Math.random() * 180;
        const jitterX = (Math.random() - 0.5) * noAnim.maxJitter;
        const jitterY = (Math.random() - 0.5) * noAnim.maxJitter;
  
        let tx = center.x + Math.cos(angle) * radius + jitterX - noAnim.w / 2;
        let ty = center.y + Math.sin(angle) * radius + jitterY - noAnim.h / 2;
  
        tx = clamp(tx, noAnim.padding, window.innerWidth - noAnim.w - noAnim.padding);
        ty = clamp(ty, noAnim.padding, window.innerHeight - noAnim.h - noAnim.padding);
  
        const tcx = tx + noAnim.w / 2;
        const tcy = ty + noAnim.h / 2;
        const md = Math.hypot(mouse.x - tcx, mouse.y - tcy);
  
        if (md >= noAnim.safeDist) {
          best = { x: tx, y: ty };
          break;
        }
  
        if (!best || md > best.md) best = { x: tx, y: ty, md };
      }
  
      noAnim.tx = best.x;
      noAnim.ty = best.y;
    }
  }
  
  function initialNoPosition(noBtn, card) {
    const rect = noBtn.getBoundingClientRect();
    const w = rect.width || 260;
    const h = rect.height || 56;
    const cardRect = card.getBoundingClientRect();
  
    let x = cardRect.left + (cardRect.width - w) / 2;
    let y = cardRect.top + Math.min(cardRect.height - h - 16, 270);
  
    const padding = 12;
    x = clamp(x, padding, window.innerWidth - w - padding);
    y = clamp(y, padding, window.innerHeight - h - padding);
  
    return { x, y };
  }
  
  function clampNo(state) {
    state.x = clamp(state.x, state.padding, window.innerWidth - state.w - state.padding);
    state.y = clamp(state.y, state.padding, window.innerHeight - state.h - state.padding);
  }
  
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  
  function cleanupNo() {
    if (noTracker) {
      window.removeEventListener('mousemove', noTracker);
      noTracker = null;
    }
    noAnim = null;
  }
  
  /* ----------------------------
     CELEBRATION
  ---------------------------- */
  function showCelebration() {
    const game = document.getElementById('game');
  
    game.innerHTML = `
      <div class="card fade-in">
        <h2>YAYYYYY 🎉💖</h2>
        <p>Best decision ever 😌💘</p>
  
        <div class="celebrate">
          <div class="photo-grid">
            <div class="photo"><img src="assets/us1.jpeg" alt="Us 1" onerror="this.parentElement.classList.add('fallback'); this.remove(); this.parentElement.textContent='Add us1.jpeg 💗';"></div>
            <div class="photo"><img src="assets/us2.jpeg" alt="Us 2" onerror="this.parentElement.classList.add('fallback'); this.remove(); this.parentElement.textContent='Add us2.jpeg 💗';"></div>
            <div class="photo"><img src="assets/us3.jpeg" alt="Us 3" onerror="this.parentElement.classList.add('fallback'); this.remove(); this.parentElement.textContent='Add us3.jpeg 💗';"></div>
            <div class="photo"><img src="assets/us4.jpeg" alt="Us 4" onerror="this.parentElement.classList.add('fallback'); this.remove(); this.parentElement.textContent='Add us4.jpeg 💗';"></div>
          </div>
        </div>
      </div>
    `;
  }
  