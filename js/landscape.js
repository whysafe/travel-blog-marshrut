// Рисует пейзаж в SVG по зерну и палитре: слои хребтов, солнце, иногда вода с отражением.
// Одинаковое зерно всегда даёт одинаковую картинку, поэтому обложки статей не «прыгают».
function landscape(seed, palette, opts) {
  opts = opts || {};
  var w = 1200, h = opts.h || 700;
  var s = seed;
  function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }

  var layers = palette.layers, sky = palette.sky;
  var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + (opts.label || 'Пейзаж') + '">';
  out += '<defs><linearGradient id="sky' + seed + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>';
  out += '<rect width="' + w + '" height="' + h + '" fill="url(#sky' + seed + ')"/>';
  out += '<circle cx="' + (200 + rnd() * 800) + '" cy="' + (h * (0.18 + rnd() * 0.15)) + '" r="' + (40 + rnd() * 30) + '" fill="' + palette.sun + '" opacity=".9"/>';

  var waterline = opts.water ? h * 0.72 : h;
  layers.forEach(function (color, i) {
    var base = h * (0.38 + i * 0.1), amp = 120 - i * 18, f1 = 0.004 + rnd() * 0.004, f2 = 0.011 + rnd() * 0.01, ph = rnd() * 10;
    var d = 'M0 ' + h;
    for (var x = 0; x <= w; x += 20) {
      var y = base - Math.abs(Math.sin(x * f1 + ph)) * amp - Math.sin(x * f2 + ph * 2) * amp * 0.3;
      d += ' L' + x + ' ' + Math.min(y, waterline).toFixed(1);
    }
    out += '<path d="' + d + ' L' + w + ' ' + h + ' Z" fill="' + color + '"/>';
  });

  if (opts.water) {
    out += '<rect y="' + waterline + '" width="' + w + '" height="' + (h - waterline) + '" fill="' + palette.water + '"/>';
    for (var k = 0; k < 14; k++) {
      var y = waterline + 12 + rnd() * (h - waterline - 20), x0 = rnd() * w;
      out += '<rect x="' + x0.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + (40 + rnd() * 120).toFixed(0) + '" height="2" fill="#fff" opacity=".25"/>';
    }
  }
  return out + '</svg>';
}
