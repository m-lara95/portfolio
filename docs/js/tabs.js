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
  var phrases = ["beep boop!", "nice pick!", "loading…", "whirr~", "01001!", "booting…"];
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

