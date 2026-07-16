// Progressive-enhancement tabs: with JS, show one project panel at a time;
// without JS, every panel just stays visible (still fully readable).
(function () {
  document.querySelectorAll(".portfolio").forEach(function (pf) {
    var tabs = Array.prototype.slice.call(pf.querySelectorAll(".tab"));
    var panels = Array.prototype.slice.call(pf.querySelectorAll(".panel"));
    if (tabs.length < 1) return;

    pf.classList.add("js-tabs"); // enables single-panel CSS

    function activate(i) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle("active", on);
      });
      panels.forEach(function (p, j) {
        p.classList.toggle("active", i === j);
      });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        activate(i);
      });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var dir = e.key === "ArrowRight" ? 1 : -1;
          var next = (i + dir + tabs.length) % tabs.length;
          tabs[next].focus();
          activate(next);
        }
      });
    });

    activate(0);
  });
})();

// Peeking robot: pops up from the bottom-right for a moment when you switch
// tabs, then ducks back out of sight. Respects reduced motion.
(function () {
  var popup = document.querySelector(".robot-popup");
  if (!popup) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var bubble = popup.querySelector(".robot-bubble");
  var phrases = [
    "beep boop!", "nice pick!", "loading…", "whirr~", "01001!", "booting…",
    "psst… ↑↑↓↓←→←→BA", "know the konami code?", "🕹 mini-game in the footer!"
  ];
  var i = 0, timer;
  document.addEventListener("click", function (ev) {
    if (!ev.target.closest || !ev.target.closest(".tab")) return;
    if (bubble) { bubble.textContent = phrases[i % phrases.length]; i++; }
    popup.classList.add("peek");
    clearTimeout(timer);
    timer = setTimeout(function () { popup.classList.remove("peek"); }, 1900);
  });
})();

// Scroll reveal: each stepper item appears as it scrolls into view.
// Progressive enhancement — without JS (or with reduced motion) every step
// just stays visible.
(function () {
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  if (!steps.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js-reveal");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  steps.forEach(function (s) { io.observe(s); });

  // Switching tabs can reveal a panel while scrolled down — immediately show
  // any of its steps that are already at/above the viewport so nothing is stuck.
  document.addEventListener("click", function (ev) {
    if (!ev.target.closest || !ev.target.closest(".tab")) return;
    requestAnimationFrame(function () {
      steps.forEach(function (s) {
        if (!s.classList.contains("in") && s.getBoundingClientRect().top < window.innerHeight * 0.92) {
          s.classList.add("in");
          io.unobserve(s);
        }
      });
    });
  });
})();

// Boop the header robot: click it for a little wiggle + reaction.
(function () {
  var robot = document.getElementById("header-robot");
  if (!robot) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var boops = ["boop!", "hehe", "hi!", "^_^", "beep!"];
  var i = 0;
  robot.addEventListener("click", function () {
    robot.classList.remove("boop");
    void robot.offsetWidth; // restart the animation
    robot.classList.add("boop");
    if (reduce) return;
    var popup = document.querySelector(".robot-popup");
    var bubble = popup && popup.querySelector(".robot-bubble");
    if (popup && bubble) {
      bubble.textContent = boops[i++ % boops.length];
      popup.classList.add("peek");
      clearTimeout(popup._boopTimer);
      popup._boopTimer = setTimeout(function () { popup.classList.remove("peek"); }, 1500);
    }
  });
})();

// Konami code -> party mode (robots dance + a burst of confetti).
(function () {
  var seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pos = 0, timer;
  document.addEventListener("keydown", function (e) {
    var g = document.getElementById("game");
    if (g && !g.hidden) return; // don't trigger while the mini-game is open
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === seq[pos] ? pos + 1 : (k === seq[0] ? 1 : 0);
    if (pos !== seq.length) return;
    pos = 0;
    document.body.classList.add("party");
    var popup = document.querySelector(".robot-popup");
    var bubble = popup && popup.querySelector(".robot-bubble");
    if (popup && bubble) { bubble.textContent = "PARTY MODE!"; popup.classList.add("peek"); }
    if (!reduce) {
      var colors = ["#2f6bef", "#ef3e46", "#ffc021", "#16a34a", "#7c3aed"];
      for (var n = 0; n < 70; n++) {
        var p = document.createElement("div");
        p.className = "pixel";
        p.style.left = (Math.random() * 100).toFixed(1) + "vw";
        p.style.background = colors[n % colors.length];
        var dur = 2 + Math.random() * 2.5;
        p.style.animationDuration = dur.toFixed(2) + "s";
        p.style.animationDelay = (Math.random() * 0.6).toFixed(2) + "s";
        document.body.appendChild(p);
        (function (el, ms) { setTimeout(function () { el.remove(); }, ms); })(p, (dur + 1) * 1000);
      }
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
      document.body.classList.remove("party");
      if (popup) popup.classList.remove("peek");
    }, 5000);
  });
})();

// Playful browser-tab message when you switch away.
(function () {
  var original = document.title;
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? "beep boop… come back! 🤖" : original;
  });
})();

// Mini-game: BOT-MUNCHER — an original maze-muncher. Drive the robot with the
// arrow keys / WASD, eat every dot, and dodge the bugs. (Not Pac-Man: original
// maze, original enemies, robot player.)
(function () {
  var overlay = document.getElementById("game");
  if (!overlay) return;
  var openBtn = document.getElementById("game-open");
  var closeBtn = document.getElementById("game-close");
  var area = document.getElementById("game-area");
  var startBtn = document.getElementById("game-start");
  var scoreEl = document.getElementById("game-score");
  var livesEl = document.getElementById("game-lives");
  var bestEl = document.getElementById("game-best");

  var TILE = 18, COLS = 15, ROWS = 13;
  var W = COLS * TILE, H = ROWS * TILE;

  // robot player sprite (reuse the favicon)
  var iconLink = document.querySelector('link[rel="icon"]');
  var sprite = new Image();
  var spriteReady = false;
  if (iconLink) { sprite.onload = function () { spriteReady = true; }; sprite.src = iconLink.href; }

  // Build a lattice maze: border walls + isolated pillars on even/even cells.
  // Guarantees every open cell is reachable.
  function buildGrid() {
    var g = [];
    for (var r = 0; r < ROWS; r++) {
      g[r] = [];
      for (var c = 0; c < COLS; c++) {
        var wall = r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1 || (r % 2 === 0 && c % 2 === 0);
        g[r][c] = wall ? 1 : 0;
      }
    }
    return g;
  }

  var DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  var canvas, ctx, grid, pellets, player, bugs, best = 0, score = 0, lives = 3, loop = null, playing = false;
  try { best = parseInt(localStorage.getItem("munch-best") || "0", 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    canvas.className = "game-canvas";
    area.appendChild(canvas);
    ctx = canvas.getContext("2d");
  }

  function open2(r, c) { return grid[r] && grid[r][c] === 0; }
  function key(r, c) { return r + "," + c; }

  function reset() {
    grid = buildGrid();
    pellets = {};
    for (var r = 1; r < ROWS - 1; r++)
      for (var c = 1; c < COLS - 1; c++)
        if (grid[r][c] === 0) pellets[key(r, c)] = true;
    player = { r: 1, c: 1, dir: null, next: null };
    delete pellets[key(1, 1)];
    bugs = [
      { r: ROWS - 2, c: COLS - 2, dir: "up", color: "#ef3e46" },
      { r: 1, c: COLS - 2, dir: "down", color: "#7c3aed" }
    ];
  }

  function step() {
    // player
    if (player.next && canStep(player.r, player.c, player.next)) player.dir = player.next;
    if (player.dir && canStep(player.r, player.c, player.dir)) {
      player.r += DIRS[player.dir][0];
      player.c += DIRS[player.dir][1];
    }
    if (pellets[key(player.r, player.c)]) {
      delete pellets[key(player.r, player.c)];
      score += 10; scoreEl.textContent = score;
    }
    // bugs
    bugs.forEach(function (b) { moveBug(b); });
    if (hit()) return loseLife();
    if (Object.keys(pellets).length === 0) return win();
    draw();
  }

  function canStep(r, c, d) { return open2(r + DIRS[d][0], c + DIRS[d][1]); }

  function moveBug(b) {
    var opts = [], rev = { up: "down", down: "up", left: "right", right: "left" };
    for (var d in DIRS) if (canStep(b.r, b.c, d) && d !== rev[b.dir]) opts.push(d);
    if (!opts.length) for (var d2 in DIRS) if (canStep(b.r, b.c, d2)) opts.push(d2);
    if (opts.length) {
      // 55% chase the player, else wander
      if (Math.random() < 0.55) {
        opts.sort(function (a, z) { return dist(b, a) - dist(b, z); });
        b.dir = opts[0];
      } else {
        b.dir = opts[(Math.random() * opts.length) | 0];
      }
      b.r += DIRS[b.dir][0]; b.c += DIRS[b.dir][1];
    }
  }
  function dist(b, d) {
    return Math.abs(b.r + DIRS[d][0] - player.r) + Math.abs(b.c + DIRS[d][1] - player.c);
  }

  function hit() {
    return bugs.some(function (b) { return b.r === player.r && b.c === player.c; });
  }

  function loseLife() {
    lives--; livesEl.textContent = lives;
    if (lives <= 0) return end("GAME OVER");
    player.r = 1; player.c = 1; player.dir = null; player.next = null;
    bugs[0].r = ROWS - 2; bugs[0].c = COLS - 2;
    bugs[1].r = 1; bugs[1].c = COLS - 2;
    draw();
  }

  function win() { end("YOU WIN! 🎉"); }

  function end(msg) {
    playing = false; clearInterval(loop); loop = null;
    if (score > best) { best = score; bestEl.textContent = best; try { localStorage.setItem("munch-best", String(best)); } catch (e) {} }
    if (canvas) canvas.style.display = "none";
    startBtn.textContent = msg + " · " + score + " · PLAY AGAIN";
    startBtn.style.display = "";
  }

  function draw() {
    ctx.fillStyle = "#12141b"; ctx.fillRect(0, 0, W, H);
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      if (grid[r][c] === 1) {
        ctx.fillStyle = "#2f6bef";
        roundRect(c * TILE + 1, r * TILE + 1, TILE - 2, TILE - 2, 4); ctx.fill();
      }
    }
    ctx.fillStyle = "#ffe08a";
    for (var p in pellets) {
      var rc = p.split(","), pr = +rc[0], pc = +rc[1];
      ctx.beginPath(); ctx.arc(pc * TILE + TILE / 2, pr * TILE + TILE / 2, 2.4, 0, 7); ctx.fill();
    }
    bugs.forEach(function (b) { drawBug(b.c * TILE, b.r * TILE, b.color); });
    var px = player.c * TILE, py = player.r * TILE;
    if (spriteReady) ctx.drawImage(sprite, px + 1, py + 1, TILE - 2, TILE - 2);
    else { ctx.fillStyle = "#ffc021"; ctx.beginPath(); ctx.arc(px + TILE / 2, py + TILE / 2, TILE / 2 - 2, 0, 7); ctx.fill(); }
  }

  function drawBug(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x + TILE / 2, y + TILE / 2 - 1, TILE / 2 - 2, Math.PI, 0);
    ctx.lineTo(x + TILE - 2, y + TILE - 3); ctx.lineTo(x + 2, y + TILE - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x + TILE / 2 - 3, y + TILE / 2 - 1, 2, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x + TILE / 2 + 3, y + TILE / 2 - 1, 2, 0, 7); ctx.fill();
  }

  function roundRect(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function start() {
    ensureCanvas();
    score = 0; lives = 3;
    scoreEl.textContent = "0"; livesEl.textContent = "3";
    reset();
    canvas.style.display = "block";
    startBtn.style.display = "none";
    playing = true;
    draw();
    clearInterval(loop);
    loop = setInterval(step, 200);
  }

  function stop() {
    playing = false; clearInterval(loop); loop = null;
    if (canvas) canvas.style.display = "none";
    startBtn.textContent = "PRESS START"; startBtn.style.display = "";
    scoreEl.textContent = "0"; livesEl.textContent = "3";
  }

  function open() { overlay.hidden = false; }
  function close() { overlay.hidden = true; stop(); }

  var KEYS = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", s: "down", a: "left", d: "right"
  };
  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") { close(); return; }
    var dir = KEYS[e.key] || KEYS[(e.key || "").toLowerCase()];
    if (dir && playing) { player.next = dir; e.preventDefault(); }
  });

  if (openBtn) openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (startBtn) startBtn.addEventListener("click", start);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
})();

