/* Seeded decorative network-mesh background, matching the existing deck art. */
(function () {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function build(host) {
    var seed = parseInt(host.dataset.seed || '7', 10);
    var side = host.dataset.side || 'right';
    var rnd = mulberry32(seed);
    var W = 1920, H = 1080;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');

    // ---- flowing contour lines (bottom-left / corner accent)
    var g0 = document.createElementNS(NS, 'g');
    for (var w = 0; w < 16; w++) {
      var p = document.createElementNS(NS, 'path');
      var y0 = 250 + w * 46 + rnd() * 20;
      var amp = 40 + rnd() * 60;
      var d = 'M -60 ' + y0;
      for (var x = 0; x <= W + 60; x += 160) {
        d += ' Q ' + (x + 80) + ' ' + (y0 + Math.sin((x + w * 90) / 260) * amp) +
             ' ' + (x + 160) + ' ' + (y0 + Math.sin((x + 160 + w * 90) / 260) * amp * 0.7);
      }
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', w % 3 === 0 ? 'rgba(232,121,249,0.10)' : 'rgba(34,211,238,0.09)');
      p.setAttribute('stroke-width', '1');
      g0.appendChild(p);
    }
    g0.setAttribute('opacity', '0.75');
    svg.appendChild(g0);

    // ---- polygon mesh in one corner
    var cx = side === 'left' ? 190 : 1740;
    var cy = side === 'left' ? 880 : 190;
    var pts = [];
    for (var i = 0; i < 34; i++) {
      var a = rnd() * Math.PI * 2;
      var r = 90 + Math.pow(rnd(), 0.62) * 620;
      pts.push([cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 0.78]);
    }
    var gm = document.createElementNS(NS, 'g');
    for (var i2 = 0; i2 < pts.length; i2++) {
      for (var j = i2 + 1; j < pts.length; j++) {
        var dx = pts[i2][0] - pts[j][0], dy = pts[i2][1] - pts[j][1];
        var dist = Math.hypot(dx, dy);
        if (dist > 300) continue;
        var ln = document.createElementNS(NS, 'line');
        ln.setAttribute('x1', pts[i2][0].toFixed(1));
        ln.setAttribute('y1', pts[i2][1].toFixed(1));
        ln.setAttribute('x2', pts[j][0].toFixed(1));
        ln.setAttribute('y2', pts[j][1].toFixed(1));
        var op = (1 - dist / 300) * 0.30;
        ln.setAttribute('stroke', (i2 + j) % 3 === 0
          ? 'rgba(232,121,249,' + op.toFixed(3) + ')'
          : 'rgba(34,211,238,' + op.toFixed(3) + ')');
        ln.setAttribute('stroke-width', '1');
        gm.appendChild(ln);
      }
    }
    for (var k = 0; k < pts.length; k++) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', pts[k][0].toFixed(1));
      c.setAttribute('cy', pts[k][1].toFixed(1));
      c.setAttribute('r', (1.4 + rnd() * 2.4).toFixed(1));
      c.setAttribute('fill', k % 4 === 0 ? 'rgba(232,121,249,0.65)' : 'rgba(34,211,238,0.6)');
      gm.appendChild(c);
    }
    svg.appendChild(gm);
    host.appendChild(svg);
  }

  document.querySelectorAll('.deco').forEach(build);
})();
