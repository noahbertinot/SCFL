/* Interactive frustration-index explorer for the Measurement Problem page.
   Four entities, six signed relations (the complete graph K4).
   The frustration index is the minimum number of relations whose sign must
   change for every cycle to be balanced (Harary, 1959). It is computed here
   exactly, by checking every way of splitting the four entities into two groups. */
(function () {
  "use strict";
  var root = document.getElementById("explorer");
  if (!root) return;

  var EDGES = ["12", "13", "14", "23", "24", "34"];
  var TRIANGLES = [["12", "13", "23"], ["12", "14", "24"], ["13", "14", "34"], ["23", "24", "34"]];
  var PRESETS = {
    a: { "12": -1, "34": -1 },
    b: { "12": -1, "13": -1 },
    none: {}
  };
  var sign = {};

  function load(preset) {
    EDGES.forEach(function (e) { sign[e] = preset[e] || 1; });
    render();
  }

  function frustrationIndex() {
    var best = Infinity;
    for (var mask = 0; mask < 8; mask++) {           // entity 1 fixed in group +1
      var s = { 1: 1, 2: mask & 1 ? -1 : 1, 3: mask & 2 ? -1 : 1, 4: mask & 4 ? -1 : 1 };
      var changes = 0;
      EDGES.forEach(function (e) {
        if (sign[e] !== s[+e[0]] * s[+e[1]]) changes++;
      });
      if (changes < best) best = changes;
    }
    return best;
  }

  function render() {
    var neg = 0, frustrated = 0;
    EDGES.forEach(function (e) {
      if (sign[e] < 0) neg++;
      var line = root.querySelector('.g-edge[data-edge="' + e + '"]');
      line.classList.toggle("neg", sign[e] < 0);
      var btn = root.querySelector('.toggle[data-edge="' + e + '"]');
      btn.setAttribute("aria-pressed", String(sign[e] < 0));
      btn.querySelector(".t-state").textContent = sign[e] < 0 ? "negative" : "positive";
    });
    TRIANGLES.forEach(function (t, i) {
      var f = sign[t[0]] * sign[t[1]] * sign[t[2]] < 0;
      if (f) frustrated++;
      root.querySelector('.g-cycle[data-tri="' + i + '"]').classList.toggle("frustrated", f);
    });
    var phi = frustrationIndex();
    var norm = (phi / 6).toFixed(2);
    root.querySelector('[data-out="signs"]').textContent = (6 - neg) + " / " + neg;
    root.querySelector('[data-out="tri"]').textContent = frustrated + " of 4";
    root.querySelector('[data-out="phi"]').textContent = phi;
    root.querySelector('[data-out="norm"]').textContent = phi + "/6 ≈ " + norm;
    root.querySelector('[data-out="live"]').textContent =
      (6 - neg) + " positive and " + neg + " negative relations. " +
      frustrated + " of 4 triangles frustrated. Frustration index " + phi + ".";
  }

  function flip(e) { sign[e] = -sign[e]; render(); }

  Array.prototype.forEach.call(root.querySelectorAll(".toggle"), function (b) {
    b.addEventListener("click", function () { flip(b.getAttribute("data-edge")); });
  });
  Array.prototype.forEach.call(root.querySelectorAll(".hit"), function (h) {
    h.addEventListener("click", function () { flip(h.getAttribute("data-edge")); });
  });
  Array.prototype.forEach.call(root.querySelectorAll(".preset"), function (p) {
    p.addEventListener("click", function () { load(PRESETS[p.getAttribute("data-preset")]); });
  });

  load(PRESETS.b);
})();
