import fs from 'fs';
import zlib from 'zlib';

// --- PNG ENCODER ---
function createPNG(width, height, buffer) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pixelOffset] = buffer[idx];
      rawData[pixelOffset + 1] = buffer[idx + 1];
      rawData[pixelOffset + 2] = buffer[idx + 2];
      rawData[pixelOffset + 3] = buffer[idx + 3];
    }
  }

  const deflated = zlib.deflateSync(rawData);

  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// --- COLOR UTILS ---
function hexToRgba(hex, alpha = 255) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b, alpha];
}

// --- 64x64 CANVAS CLASS ---
class PixelCanvas {
  constructor(w = 64, h = 64) {
    this.w = w;
    this.h = h;
    this.buf = new Uint8Array(w * h * 4); // all 0 (transparent)
  }

  set(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const idx = (y * this.w + x) * 4;
    const [r, g, b, a = 255] = Array.isArray(color) ? color : hexToRgba(color);
    if (a < 255 && this.buf[idx + 3] > 0) {
      // Alpha blend
      const sa = a / 255;
      const da = (this.buf[idx + 3] / 255) * (1 - sa);
      const outA = sa + da;
      this.buf[idx] = Math.round((r * sa + this.buf[idx] * da) / outA);
      this.buf[idx + 1] = Math.round((g * sa + this.buf[idx + 1] * da) / outA);
      this.buf[idx + 2] = Math.round((b * sa + this.buf[idx + 2] * da) / outA);
      this.buf[idx + 3] = Math.round(outA * 255);
    } else {
      this.buf[idx] = r;
      this.buf[idx + 1] = g;
      this.buf[idx + 2] = b;
      this.buf[idx + 3] = a;
    }
  }

  get(x, y) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return [0, 0, 0, 0];
    const idx = (y * this.w + x) * 4;
    return [this.buf[idx], this.buf[idx + 1], this.buf[idx + 2], this.buf[idx + 3]];
  }

  fillRect(x, y, w, h, color) {
    for (let cy = y; cy < y + h; cy++) {
      for (let cx = x; cx < x + w; cx++) {
        this.set(cx, cy, color);
      }
    }
  }

  fillEllipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1.0) {
          this.set(x, y, color);
        }
      }
    }
  }

  strokeEllipse(cx, cy, rx, ry, color, thickness = 1) {
    for (let y = Math.floor(cy - ry - thickness); y <= Math.ceil(cy + ry + thickness); y++) {
      for (let x = Math.floor(cx - rx - thickness); x <= Math.ceil(cx + rx + thickness); x++) {
        const d = (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2;
        const dInner = (x - cx) ** 2 / (rx - thickness) ** 2 + (y - cy) ** 2 / (ry - thickness) ** 2;
        if (d <= 1.05 && dInner >= 0.95) {
          this.set(x, y, color);
        }
      }
    }
  }

  fillPolygon(points, color) {
    // Standard scanline polygon fill
    let minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p[1] < minY) minY = p[1];
      if (p[1] > maxY) maxY = p[1];
    }
    minY = Math.max(0, Math.floor(minY));
    maxY = Math.min(this.h - 1, Math.ceil(maxY));

    for (let y = minY; y <= maxY; y++) {
      const nodeX = [];
      let j = points.length - 1;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[j];
        if ((p1[1] < y && p2[1] >= y) || (p2[1] < y && p1[1] >= y)) {
          nodeX.push(p1[0] + ((y - p1[1]) / (p2[1] - p1[1])) * (p2[0] - p1[0]));
        }
        j = i;
      }
      nodeX.sort((a, b) => a - b);
      for (let i = 0; i < nodeX.length; i += 2) {
        if (nodeX[i] >= this.w) break;
        if (nodeX[i + 1] > 0) {
          const xStart = Math.max(0, Math.round(nodeX[i]));
          const xEnd = Math.min(this.w - 1, Math.round(nodeX[i + 1]));
          for (let x = xStart; x <= xEnd; x++) {
            this.set(x, y, color);
          }
        }
      }
    }
  }

  strokeLine(x0, y0, x1, y1, color, thickness = 1) {
    x0 = Math.round(x0); y0 = Math.round(y0);
    x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (thickness <= 1) {
        this.set(x0, y0, color);
      } else {
        const r = Math.floor(thickness / 2);
        for (let ox = -r; ox <= r; ox++) {
          for (let oy = -r; oy <= r; oy++) {
            this.set(x0 + ox, y0 + oy, color);
          }
        }
      }
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  // Applies 2px thick black arcade outline to non-empty silhouette, then fills background with #0E0B1C
  finalizeArcadeSprite(bgColor = '#0E0B1C', outlineColor = '#000000', outlineThickness = 2) {
    // Selective, two-tone clusters along material boundaries. Keep eyes and
    // dark linework intact; no random texture or smooth gradients.
    const source = this.buf.slice();
    const same = (x, y, i) => {
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
      const j = (y * this.w + x) * 4;
      return source[j + 3] > 200 && source[j] === source[i] && source[j + 1] === source[i + 1] && source[j + 2] === source[i + 2];
    };
    for (let y = 1; y < this.h - 1; y++) for (let x = 1; x < this.w - 1; x++) {
      const i = (y * this.w + x) * 4;
      const brightness = (source[i] + source[i + 1] + source[i + 2]) / 3;
      if (source[i + 3] < 250 || brightness < 45 || brightness > 235) continue;
      // Only large color fields receive modelling, never single-pixel features.
      if (!same(x - 1, y, i) || !same(x + 1, y, i)) continue;
      const lit = !same(x, y - 2, i) && same(x, y + 2, i);
      const shade = !same(x + 2, y + 2, i) && same(x - 2, y - 2, i);
      if (!lit && !shade) continue;
      for (let k = 0; k < 3; k++) this.buf[i + k] = lit
        ? Math.min(255, source[i + k] + [20, 16, 10][k])
        : Math.max(0, source[i + k] - [27, 25, 17][k]);
    }
    const isSolid = new Uint8Array(this.w * this.h);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const idx = (y * this.w + x) * 4;
        if (this.buf[idx + 3] > 30) {
          isSolid[y * this.w + x] = 1;
        }
      }
    }

    const outlinePixels = [];
    const t = outlineThickness;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (isSolid[y * this.w + x] === 0) {
          // Check if within thickness of any solid pixel
          let near = false;
          for (let dy = -t; dy <= t && !near; dy++) {
            for (let dx = -t; dx <= t && !near; dx++) {
              if (dx * dx + dy * dy <= t * t + 0.5) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.w && ny >= 0 && ny < this.h) {
                  if (isSolid[ny * this.w + nx] === 1) {
                    near = true;
                  }
                }
              }
            }
          }
          if (near) {
            outlinePixels.push([x, y]);
          }
        }
      }
    }

    // Draw outline
    const [or, og, ob, oa] = hexToRgba(outlineColor, 255);
    for (const [ox, oy] of outlinePixels) {
      const idx = (oy * this.w + ox) * 4;
      this.buf[idx] = or;
      this.buf[idx + 1] = og;
      this.buf[idx + 2] = ob;
      this.buf[idx + 3] = oa;
      isSolid[oy * this.w + ox] = 1;
    }

    // Fill remainder with background
    const [br, bg, bb, ba] = hexToRgba(bgColor, 255);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const idx = (y * this.w + x) * 4;
        if (this.buf[idx + 3] === 0) {
          this.buf[idx] = br;
          this.buf[idx + 1] = bg;
          this.buf[idx + 2] = bb;
          this.buf[idx + 3] = ba;
        }
      }
    }
  }

  toPNG() {
    return createPNG(this.w, this.h, this.buf);
  }
}

// Ensure directory exists
if (!fs.existsSync('public/avatars')) {
  fs.mkdirSync('public/avatars', { recursive: true });
}

console.log('Building 20 strict 64x64 FULL-FACE ONLY pixel avatars...');

// ==========================================
// 1. PETER PARKER (Spider-Man)
// ==========================================
function buildPeterParker() {
  const c = new PixelCanvas(64, 64);
  // Red mask base
  c.fillEllipse(32, 33, 20, 24, '#D90429');
  c.fillEllipse(32, 35, 18, 22, '#EF233C');
  // Shading on lower jaw/chin
  for (let y = 48; y <= 57; y++) {
    for (let x = 20; x <= 44; x++) {
      if ((x - 32) ** 2 / 16 ** 2 + (y - 34) ** 2 / 23 ** 2 <= 1.0) {
        c.set(x, y, '#9E1A1A');
      }
    }
  }

  // Radial web lines converging between eyes (center at 32, 29)
  const webColor = '#111827';
  c.strokeLine(32, 29, 32, 10, webColor, 1); // vertical up
  c.strokeLine(32, 29, 32, 57, webColor, 1); // vertical down
  c.strokeLine(32, 29, 13, 24, webColor, 1); // left
  c.strokeLine(32, 29, 51, 24, webColor, 1); // right
  c.strokeLine(32, 29, 18, 14, webColor, 1); // up-left
  c.strokeLine(32, 29, 46, 14, webColor, 1); // up-right
  c.strokeLine(32, 29, 17, 46, webColor, 1); // down-left
  c.strokeLine(32, 29, 47, 46, webColor, 1); // down-right

  // Web arches (concentric curved rings)
  c.strokeEllipse(32, 29, 8, 9, webColor, 1);
  c.strokeEllipse(32, 29, 14, 16, webColor, 1);
  c.strokeEllipse(32, 29, 18, 21, webColor, 1);

  // Large angled almond eye lenses
  const leftEye = [[16, 26], [28, 23], [30, 31], [25, 38], [17, 34]];
  const rightEye = [[48, 26], [36, 23], [34, 31], [39, 38], [47, 34]];

  // Eye thick black borders
  c.fillPolygon(leftEye.map(([x, y]) => [x - 2, y]), '#000000');
  c.fillPolygon(leftEye.map(([x, y]) => [x + 1, y]), '#000000');
  c.fillPolygon(leftEye.map(([x, y]) => [x, y - 2]), '#000000');
  c.fillPolygon(leftEye.map(([x, y]) => [x, y + 2]), '#000000');

  c.fillPolygon(rightEye.map(([x, y]) => [x + 2, y]), '#000000');
  c.fillPolygon(rightEye.map(([x, y]) => [x - 1, y]), '#000000');
  c.fillPolygon(rightEye.map(([x, y]) => [x, y - 2]), '#000000');
  c.fillPolygon(rightEye.map(([x, y]) => [x, y + 2]), '#000000');

  // Eye white lens centers with cyan/ice-blue gradient
  c.fillPolygon(leftEye, '#FFFFFF');
  c.fillPolygon(rightEye, '#FFFFFF');
  c.fillPolygon([[18, 30], [24, 27], [27, 34], [23, 36]], '#E0F2FE');
  c.fillPolygon([[46, 30], [40, 27], [37, 34], [41, 36]], '#E0F2FE');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 2. BRUCE WAYNE (Batman)
// ==========================================
function buildBruceWayne() {
  const c = new PixelCanvas(64, 64);
  // Cowl base
  c.fillEllipse(32, 34, 19, 22, '#161922');
  // Bat ears pointing up
  c.fillPolygon([[14, 32], [13, 8], [21, 24]], '#161922');
  c.fillPolygon([[50, 32], [51, 8], [43, 24]], '#161922');
  // Ear inner highlights
  c.fillPolygon([[15, 30], [15, 12], [19, 24]], '#262B3A');
  c.fillPolygon([[49, 30], [49, 12], [45, 24]], '#262B3A');

  // Forehead cowl highlight
  c.fillEllipse(32, 22, 12, 6, '#262B3A');

  // Lower face cowl opening (chiseled jaw/chin)
  const faceArea = [[23, 38], [41, 38], [42, 50], [37, 56], [27, 56], [22, 50]];
  c.fillPolygon(faceArea, '#F5CEB2');
  // Jawline shadows
  c.fillPolygon([[22, 46], [26, 56], [23, 56]], '#D4A383');
  c.fillPolygon([[42, 46], [38, 56], [41, 56]], '#D4A383');
  // 5 o'clock stubble shadow on chin
  for (let y = 48; y <= 55; y++) {
    for (let x = 25; x <= 39; x++) {
      if ((x + y) % 2 === 0) c.set(x, y, '#B28669');
    }
  }
  // Determined mouth line
  c.strokeLine(27, 49, 37, 49, '#573322', 2);
  c.strokeLine(26, 50, 28, 51, '#573322', 1);
  c.strokeLine(38, 50, 36, 51, '#573322', 1);

  // Nose bridge in cowl
  c.fillPolygon([[31, 30], [33, 30], [34, 40], [32, 41], [30, 40]], '#0D0F14');

  // White glowing slit eyes in cowl
  c.fillPolygon([[21, 32], [29, 33], [28, 36], [20, 34]], '#000000');
  c.fillPolygon([[43, 32], [35, 33], [36, 36], [44, 34]], '#000000');
  c.strokeLine(22, 33, 27, 34, '#FFFFFF', 2);
  c.strokeLine(42, 33, 37, 34, '#FFFFFF', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 3. TONY STARK (Iron Man)
// ==========================================
function buildTonyStark() {
  const c = new PixelCanvas(64, 64);
  // Red helmet skull
  c.fillEllipse(32, 32, 19, 24, '#991B1B');
  c.fillEllipse(32, 30, 17, 21, '#B91C1C');

  // Gold faceplate
  const faceplate = [
    [21, 16], [43, 16],
    [46, 26], [45, 42],
    [39, 56], [25, 56],
    [19, 42], [18, 26]
  ];
  c.fillPolygon(faceplate, '#F5C242');

  // Faceplate inner shading & panel cuts
  c.fillPolygon([[23, 20], [41, 20], [43, 30], [21, 30]], '#EAB308');
  c.strokeLine(21, 28, 43, 28, '#78350F', 2); // brow seam

  // Cheek plate cuts
  c.strokeLine(22, 38, 26, 54, '#78350F', 2);
  c.strokeLine(42, 38, 38, 54, '#78350F', 2);

  // Glowing Cyan Horizontal Eye Slits
  c.fillRect(21, 32, 8, 4, '#000000');
  c.fillRect(35, 32, 8, 4, '#000000');
  c.fillRect(22, 33, 6, 2, '#00F5D4');
  c.fillRect(36, 33, 6, 2, '#00F5D4');
  c.fillRect(23, 33, 4, 1, '#E0FFFF'); // bright core
  c.fillRect(37, 33, 4, 1, '#E0FFFF');

  // Mouth vent
  c.strokeLine(28, 48, 36, 48, '#78350F', 2);
  c.strokeLine(29, 52, 35, 52, '#78350F', 1);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 4. MILES MORALES (Spider-Man Miles)
// ==========================================
function buildMilesMorales() {
  const c = new PixelCanvas(64, 64);
  // Matte black/charcoal cowl
  c.fillEllipse(32, 33, 20, 24, '#14131B');
  c.fillEllipse(32, 35, 17, 21, '#201E2B');

  // Vibrant crimson red web lines
  const webColor = '#EF233C';
  c.strokeLine(32, 29, 32, 10, webColor, 1);
  c.strokeLine(32, 29, 32, 56, webColor, 1);
  c.strokeLine(32, 29, 13, 25, webColor, 1);
  c.strokeLine(32, 29, 51, 25, webColor, 1);
  c.strokeLine(32, 29, 18, 14, webColor, 1);
  c.strokeLine(32, 29, 46, 14, webColor, 1);
  c.strokeLine(32, 29, 18, 46, webColor, 1);
  c.strokeLine(32, 29, 46, 46, webColor, 1);

  // Web rings
  c.strokeEllipse(32, 29, 9, 10, webColor, 1);
  c.strokeEllipse(32, 29, 15, 17, webColor, 1);

  // Large expressive eye lenses with thick red and black borders
  const leftEye = [[16, 26], [28, 23], [30, 31], [25, 38], [17, 34]];
  const rightEye = [[48, 26], [36, 23], [34, 31], [39, 38], [47, 34]];

  // Red lens rim
  c.fillPolygon(leftEye.map(([x, y]) => [x - 2, y]), '#EF233C');
  c.fillPolygon(leftEye.map(([x, y]) => [x + 1, y]), '#EF233C');
  c.fillPolygon(leftEye.map(([x, y]) => [x, y - 2]), '#EF233C');
  c.fillPolygon(leftEye.map(([x, y]) => [x, y + 2]), '#EF233C');

  c.fillPolygon(rightEye.map(([x, y]) => [x + 2, y]), '#EF233C');
  c.fillPolygon(rightEye.map(([x, y]) => [x - 1, y]), '#EF233C');
  c.fillPolygon(rightEye.map(([x, y]) => [x, y - 2]), '#EF233C');
  c.fillPolygon(rightEye.map(([x, y]) => [x, y + 2]), '#EF233C');

  // White lens interior
  c.fillPolygon(leftEye, '#FFFFFF');
  c.fillPolygon(rightEye, '#FFFFFF');
  c.fillPolygon([[18, 30], [24, 27], [27, 34], [23, 36]], '#E2E8F0');
  c.fillPolygon([[46, 30], [40, 27], [37, 34], [41, 36]], '#E2E8F0');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 5. GWEN STACY (Spider-Gwen)
// ==========================================
function buildGwenStacy() {
  const c = new PixelCanvas(64, 64);
  // White hood silhouette wrapping around head
  c.fillEllipse(32, 32, 21, 26, '#F8FAFC');
  // Hood inner cloth shadow
  c.fillEllipse(32, 34, 18, 22, '#CBD5E1');

  // Hood opening (reveals face mask inside)
  c.fillEllipse(32, 35, 14, 18, '#0F172A'); // inner dark void
  c.fillEllipse(32, 36, 13, 17, '#FFFFFF'); // white mask inside hood

  // Magenta web lining inside hood rim
  c.strokeEllipse(32, 35, 15, 19, '#FF2A85', 2);
  c.strokeLine(20, 25, 23, 33, '#00F5D4', 1);
  c.strokeLine(44, 25, 41, 33, '#00F5D4', 1);

  // Large stylized eye lenses with vibrant magenta/teal accents
  const leftEye = [[22, 29], [30, 27], [31, 34], [27, 40], [22, 36]];
  const rightEye = [[42, 29], [34, 27], [33, 34], [37, 40], [42, 36]];

  // Magenta eye eyeliner
  c.fillPolygon(leftEye.map(([x, y]) => [x - 1, y]), '#FF2A85');
  c.fillPolygon(leftEye.map(([x, y]) => [x, y - 1]), '#FF2A85');
  c.fillPolygon(rightEye.map(([x, y]) => [x + 1, y]), '#FF2A85');
  c.fillPolygon(rightEye.map(([x, y]) => [x, y - 1]), '#FF2A85');

  // Teal inner eye
  c.fillPolygon(leftEye, '#00F5D4');
  c.fillPolygon(rightEye, '#00F5D4');
  c.fillPolygon([[24, 30], [28, 29], [29, 34], [25, 37]], '#FFFFFF');
  c.fillPolygon([[40, 30], [36, 29], [35, 34], [39, 37]], '#FFFFFF');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 6. NARUTO UZUMAKI
// ==========================================
function buildNarutoUzumaki() {
  const c = new PixelCanvas(64, 64);
  // Spiky golden hair base & points
  c.fillEllipse(32, 26, 22, 20, '#FACC15');
  const hairSpikes = [
    [[14, 24], [8, 12], [22, 16]],
    [[20, 16], [18, 6], [28, 12]],
    [[28, 12], [32, 4], [36, 12]],
    [[36, 12], [46, 6], [44, 16]],
    [[42, 16], [56, 12], [50, 24]],
    [[10, 32], [4, 24], [14, 26]],
    [[54, 32], [60, 24], [50, 26]]
  ];
  for (const spike of hairSpikes) {
    c.fillPolygon(spike, '#FACC15');
  }

  // Face flesh tone
  c.fillEllipse(32, 40, 16, 17, '#FDE68A');
  c.fillEllipse(32, 42, 14, 15, '#FCD34D');

  // Navy headband strap
  c.fillRect(16, 22, 32, 10, '#1E293B');
  // Silver metal forehead plate
  c.fillRect(20, 23, 24, 8, '#94A3B8');
  c.fillRect(21, 24, 22, 6, '#E2E8F0');
  // Leaf village swirl symbol
  c.strokeEllipse(32, 27, 4, 2, '#0F172A', 1);
  c.strokeLine(31, 27, 35, 27, '#0F172A', 1);

  // Spiky blonde bangs framing forehead
  c.fillPolygon([[18, 30], [22, 36], [26, 31]], '#FACC15');
  c.fillPolygon([[38, 31], [42, 36], [46, 30]], '#FACC15');

  // Blue Anime Eyes
  c.fillRect(22, 37, 6, 4, '#FFFFFF');
  c.fillRect(36, 37, 6, 4, '#FFFFFF');
  c.fillRect(24, 37, 3, 4, '#0284C7');
  c.fillRect(37, 37, 3, 4, '#0284C7');
  c.fillRect(25, 38, 1, 2, '#000000');
  c.fillRect(38, 38, 1, 2, '#000000');
  c.fillRect(24, 37, 1, 1, '#FFFFFF');
  c.fillRect(37, 37, 1, 1, '#FFFFFF');

  // Eyebrows
  c.strokeLine(21, 35, 28, 36, '#CA8A04', 2);
  c.strokeLine(43, 35, 36, 36, '#CA8A04', 2);

  // 3 Whiskers on each cheek
  c.strokeLine(18, 44, 24, 44, '#78350F', 1);
  c.strokeLine(18, 46, 25, 47, '#78350F', 1);
  c.strokeLine(19, 49, 24, 50, '#78350F', 1);

  c.strokeLine(46, 44, 40, 44, '#78350F', 1);
  c.strokeLine(46, 46, 39, 47, '#78350F', 1);
  c.strokeLine(45, 49, 40, 50, '#78350F', 1);

  // Smirking mouth
  c.strokeLine(28, 51, 36, 52, '#78350F', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 7. GOJO SATORU
// ==========================================
function buildGojoSatoru() {
  const c = new PixelCanvas(64, 64);
  // Fluffy spiky white hair base
  c.fillEllipse(32, 24, 23, 20, '#E2E8F0');
  const whiteSpikes = [
    [[14, 22], [8, 10], [22, 14]],
    [[20, 14], [16, 4], [28, 10]],
    [[28, 10], [32, 2], [36, 10]],
    [[36, 10], [48, 4], [44, 14]],
    [[42, 14], [56, 10], [50, 22]],
    [[10, 30], [5, 20], [15, 24]],
    [[54, 30], [59, 20], [49, 24]]
  ];
  for (const s of whiteSpikes) {
    c.fillPolygon(s, '#FFFFFF');
  }

  // Fair pale face
  c.fillEllipse(32, 40, 16, 17, '#FFF1F2');
  c.fillEllipse(32, 42, 14, 15, '#FFE4E6');

  // White hair fringe strands over forehead
  c.fillPolygon([[18, 22], [22, 32], [26, 24]], '#FFFFFF');
  c.fillPolygon([[28, 22], [33, 33], [37, 24]], '#FFFFFF');
  c.fillPolygon([[38, 22], [43, 31], [46, 23]], '#FFFFFF');

  // Midnight black blindfold covering eye region
  c.fillRect(16, 30, 32, 12, '#0F172A');
  c.strokeLine(16, 30, 48, 30, '#1E293B', 1);
  c.strokeLine(16, 35, 48, 35, '#334155', 1);
  c.strokeLine(16, 41, 48, 41, '#020617', 1);

  // Pale nose & Playful smirk
  c.set(32, 46, '#E11D48');
  c.strokeLine(28, 51, 37, 50, '#FB7185', 2);
  c.set(38, 49, '#E11D48');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 8. LEVI ACKERMAN
// ==========================================
function buildLeviAckerman() {
  const c = new PixelCanvas(64, 64);
  // Jet-black undercut hair
  c.fillEllipse(32, 26, 21, 19, '#0B0D13');
  // Undercut shaved temple areas
  c.fillRect(13, 26, 6, 16, '#1E293B');
  c.fillRect(45, 26, 6, 16, '#1E293B');

  // Sharp pale face
  c.fillEllipse(32, 38, 16, 18, '#F4F4F5');
  c.fillEllipse(32, 42, 13, 15, '#E4E4E7');

  // Iconic center-parted black bangs
  c.fillPolygon([[16, 20], [22, 36], [28, 22]], '#0B0D13');
  c.fillPolygon([[27, 20], [30, 34], [34, 20]], '#0B0D13');
  c.fillPolygon([[34, 20], [42, 36], [48, 20]], '#0B0D13');

  // Narrow deadpan gunmetal-grey eyes
  c.fillRect(20, 37, 8, 3, '#FFFFFF');
  c.fillRect(36, 37, 8, 3, '#FFFFFF');
  c.fillRect(23, 37, 3, 3, '#475569');
  c.fillRect(38, 37, 3, 3, '#475569');
  c.fillRect(24, 38, 1, 2, '#0B0D13');
  c.fillRect(39, 38, 1, 2, '#0B0D13');
  c.strokeLine(19, 36, 29, 37, '#000000', 2);
  c.strokeLine(45, 36, 35, 37, '#000000', 2);

  // Sharp nose & thin mouth
  c.set(32, 45, '#71717A');
  c.strokeLine(28, 51, 36, 51, '#52525B', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 9. L LAWLIET (Death Note)
// ==========================================
function buildLLawliet() {
  const c = new PixelCanvas(64, 64);
  // Wild, disheveled messy black hair
  c.fillEllipse(32, 26, 22, 20, '#0A0A0C');
  const messySpikes = [
    [[12, 24], [6, 12], [20, 16]],
    [[18, 16], [14, 6], [26, 14]],
    [[26, 14], [30, 4], [34, 14]],
    [[34, 14], [44, 4], [42, 16]],
    [[42, 16], [58, 12], [52, 24]],
    [[10, 34], [4, 26], [16, 28]],
    [[54, 34], [60, 26], [48, 28]],
    [[18, 20], [21, 36], [25, 22]],
    [[26, 22], [32, 40], [36, 22]],
    [[37, 22], [43, 36], [46, 20]]
  ];
  for (const s of messySpikes) {
    c.fillPolygon(s, '#0A0A0C');
  }

  // Paper-white pale face
  c.fillEllipse(32, 38, 15, 17, '#F4F4F5');

  // Deep black insomnia circles/bags under eyes
  c.fillEllipse(24, 38, 6, 5, '#27272A');
  c.fillEllipse(40, 38, 6, 5, '#27272A');

  // Big round dark eyes
  c.fillRect(22, 35, 6, 5, '#FFFFFF');
  c.fillRect(36, 35, 6, 5, '#FFFFFF');
  c.fillRect(23, 35, 4, 5, '#000000');
  c.fillRect(37, 35, 4, 5, '#000000');
  c.fillRect(24, 36, 1, 1, '#FFFFFF');
  c.fillRect(38, 36, 1, 1, '#FFFFFF');

  // Pale nose & brooding mouth
  c.set(32, 45, '#A1A1AA');
  c.strokeLine(29, 51, 35, 51, '#52525B', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 10. ELSA (Frozen)
// ==========================================
function buildElsa() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 28, 22, 22, '#FEF9C3');
  c.fillEllipse(44, 38, 10, 18, '#FEF08A');
  c.fillEllipse(48, 48, 8, 12, '#FDE047');

  c.fillEllipse(30, 38, 15, 17, '#FFF1F2');
  c.fillEllipse(30, 41, 13, 14, '#FFE4E6');

  c.fillPolygon([[16, 22], [22, 32], [27, 24]], '#FEF9C3');
  c.fillPolygon([[28, 20], [33, 29], [38, 22]], '#FEF9C3');

  // Snowflake pin
  c.fillRect(44, 26, 3, 3, '#38BDF8');
  c.set(45, 25, '#CFFAFE');
  c.set(45, 29, '#CFFAFE');
  c.set(43, 27, '#CFFAFE');
  c.set(47, 27, '#CFFAFE');

  // Eyes & Lashes
  c.strokeLine(19, 34, 27, 34, '#6366F1', 1);
  c.strokeLine(33, 34, 41, 34, '#6366F1', 1);

  c.fillRect(20, 36, 7, 5, '#FFFFFF');
  c.fillRect(34, 36, 7, 5, '#FFFFFF');
  c.fillRect(22, 36, 4, 5, '#2563EB');
  c.fillRect(36, 36, 4, 5, '#2563EB');
  c.fillRect(23, 37, 2, 3, '#1E40AF');
  c.fillRect(37, 37, 2, 3, '#1E40AF');
  c.fillRect(22, 36, 1, 1, '#FFFFFF');
  c.fillRect(36, 36, 1, 1, '#FFFFFF');

  c.strokeLine(19, 35, 27, 35, '#000000', 1);
  c.strokeLine(33, 35, 41, 35, '#000000', 1);

  c.strokeLine(27, 49, 33, 49, '#F43F5E', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 11. RAPUNZEL (Tangled)
// ==========================================
function buildRapunzel() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 28, 24, 24, '#FDE047');
  c.fillEllipse(18, 38, 10, 18, '#EAB308');
  c.fillEllipse(46, 38, 10, 18, '#EAB308');

  c.fillEllipse(32, 38, 15, 17, '#FEF3C7');
  c.fillEllipse(32, 41, 13, 14, '#FDE68A');

  // Wildflowers
  c.fillRect(16, 24, 3, 3, '#F43F5E');
  c.set(17, 25, '#FEF08A');
  c.fillRect(48, 26, 3, 3, '#A855F7');
  c.set(49, 27, '#FEF08A');
  c.fillRect(45, 42, 3, 3, '#EC4899');
  c.set(46, 43, '#FEF08A');

  c.fillPolygon([[20, 24], [25, 33], [30, 25]], '#FDE047');
  c.fillPolygon([[32, 24], [37, 33], [42, 25]], '#FDE047');

  c.fillRect(21, 36, 7, 5, '#FFFFFF');
  c.fillRect(36, 36, 7, 5, '#FFFFFF');
  c.fillRect(23, 36, 4, 5, '#10B981');
  c.fillRect(38, 36, 4, 5, '#10B981');
  c.fillRect(24, 37, 2, 3, '#047857');
  c.fillRect(39, 37, 2, 3, '#047857');
  c.fillRect(23, 36, 1, 1, '#FFFFFF');
  c.fillRect(38, 36, 1, 1, '#FFFFFF');

  // Freckles
  c.set(24, 44, '#B45309');
  c.set(26, 45, '#B45309');
  c.set(31, 44, '#B45309');
  c.set(33, 44, '#B45309');
  c.set(38, 45, '#B45309');
  c.set(40, 44, '#B45309');

  c.strokeLine(28, 49, 36, 49, '#E11D48', 2);
  c.set(32, 50, '#FB7185');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 12. MOANA
// ==========================================
function buildMoana() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 28, 24, 24, '#1C1917');
  const curls = [
    [10, 24, 7], [8, 34, 8], [10, 44, 8],
    [54, 24, 7], [56, 34, 8], [54, 44, 8],
    [32, 10, 8]
  ];
  for (const [cx, cy, r] of curls) {
    c.fillEllipse(cx, cy, r, r, '#292524');
  }

  // Flower
  c.fillEllipse(48, 22, 6, 6, '#FEF08A');
  c.fillEllipse(48, 22, 3, 3, '#F43F5E');

  c.fillEllipse(32, 38, 15, 17, '#CA8A04');
  c.fillEllipse(32, 41, 13, 14, '#F59E0B');

  c.fillPolygon([[20, 24], [24, 32], [28, 25]], '#1C1917');
  c.fillPolygon([[36, 25], [40, 32], [44, 24]], '#1C1917');

  c.fillRect(21, 36, 7, 5, '#FFFFFF');
  c.fillRect(36, 36, 7, 5, '#FFFFFF');
  c.fillRect(23, 36, 4, 5, '#78350F');
  c.fillRect(38, 36, 4, 5, '#78350F');
  c.fillRect(24, 37, 2, 3, '#451A03');
  c.fillRect(39, 37, 2, 3, '#451A03');
  c.fillRect(23, 36, 1, 1, '#FFFFFF');
  c.fillRect(38, 36, 1, 1, '#FFFFFF');

  c.strokeLine(20, 34, 28, 34, '#1C1917', 2);
  c.strokeLine(44, 34, 36, 34, '#1C1917', 2);
  c.strokeLine(28, 50, 36, 50, '#991B1B', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 13. HERMIONE GRANGER
// ==========================================
function buildHermioneGranger() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 28, 24, 25, '#78350F');
  const hairPuffs = [
    [10, 26, 8], [8, 36, 8], [10, 46, 8],
    [54, 26, 8], [56, 36, 8], [54, 46, 8],
    [22, 12, 7], [42, 12, 7], [32, 10, 8]
  ];
  for (const [hx, hy, r] of hairPuffs) {
    c.fillEllipse(hx, hy, r, r, '#92400E');
  }

  c.fillEllipse(32, 38, 15, 17, '#FDF4EC');
  c.fillEllipse(32, 41, 13, 14, '#FDE68A');

  c.fillPolygon([[22, 22], [26, 31], [30, 23]], '#78350F');
  c.fillPolygon([[34, 23], [38, 31], [42, 22]], '#78350F');

  c.fillRect(21, 36, 7, 5, '#FFFFFF');
  c.fillRect(36, 36, 7, 5, '#FFFFFF');
  c.fillRect(23, 36, 4, 5, '#B45309');
  c.fillRect(38, 36, 4, 5, '#B45309');
  c.fillRect(24, 37, 2, 3, '#78350F');
  c.fillRect(39, 37, 2, 3, '#78350F');
  c.fillRect(23, 36, 1, 1, '#FFFFFF');
  c.fillRect(38, 36, 1, 1, '#FFFFFF');

  c.strokeLine(20, 34, 28, 33, '#78350F', 2);
  c.strokeLine(44, 34, 36, 33, '#78350F', 2);
  c.strokeLine(28, 49, 36, 49, '#9A3412', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 14. WEDNESDAY ADDAMS
// ==========================================
function buildWednesdayAddams() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 26, 21, 20, '#09090B');
  c.fillRect(10, 30, 6, 24, '#18181B');
  c.fillRect(48, 30, 6, 24, '#18181B');
  for (let y = 32; y <= 52; y += 4) {
    c.set(12, y, '#27272A');
    c.set(50, y, '#27272A');
  }

  c.fillEllipse(32, 38, 15, 17, '#F8FAFC');
  c.fillEllipse(32, 42, 13, 14, '#E2E8F0');
  c.fillRect(18, 22, 28, 9, '#09090B');

  c.fillEllipse(24, 38, 6, 4, '#1E293B');
  c.fillEllipse(40, 38, 6, 4, '#1E293B');

  c.fillRect(21, 36, 6, 4, '#FFFFFF');
  c.fillRect(37, 36, 6, 4, '#FFFFFF');
  c.fillRect(23, 36, 3, 4, '#09090B');
  c.fillRect(38, 36, 3, 4, '#09090B');
  c.fillRect(23, 36, 1, 1, '#E2E8F0');
  c.fillRect(38, 36, 1, 1, '#E2E8F0');

  c.strokeLine(28, 51, 36, 51, '#475569', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 15. OFFICER K
// ==========================================
function buildOfficerK() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 26, 20, 18, '#78350F');
  c.fillPolygon([[18, 14], [24, 8], [34, 10]], '#92400E');
  c.fillPolygon([[32, 10], [42, 8], [48, 14]], '#B45309');

  c.fillEllipse(32, 38, 16, 18, '#F5CEB2');
  c.fillEllipse(32, 42, 14, 15, '#D4A383');

  c.fillPolygon([[18, 22], [24, 30], [30, 24]], '#78350F');
  c.fillPolygon([[30, 22], [36, 29], [42, 22]], '#92400E');

  c.fillRect(21, 36, 7, 4, '#FFFFFF');
  c.fillRect(36, 36, 7, 4, '#FFFFFF');
  c.fillRect(23, 36, 3, 4, '#64748B');
  c.fillRect(38, 36, 3, 4, '#64748B');
  c.fillRect(24, 37, 1, 2, '#38BDF8');
  c.fillRect(39, 37, 1, 2, '#38BDF8');

  c.strokeLine(20, 33, 28, 34, '#573322', 2);
  c.strokeLine(44, 33, 36, 34, '#573322', 2);
  c.set(40, 33, '#F43F5E');

  for (let y = 46; y <= 55; y++) {
    for (let x = 22; x <= 42; x++) {
      if ((x + y) % 2 === 0 && (x - 32) ** 2 / 13 ** 2 + (y - 40) ** 2 / 14 ** 2 <= 1.0) {
        c.set(x, y, '#573322');
      }
    }
  }

  c.strokeLine(28, 50, 36, 50, '#573322', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 16. NEO
// ==========================================
function buildNeo() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 26, 20, 19, '#09090B');
  c.fillEllipse(32, 23, 17, 14, '#18181B');

  c.fillEllipse(32, 38, 15, 17, '#F4F4F5');
  c.fillEllipse(32, 42, 13, 14, '#E4E4E7');

  c.fillRect(15, 24, 4, 16, '#09090B');
  c.fillRect(45, 24, 4, 16, '#09090B');

  // Sunglasses
  c.fillEllipse(24, 36, 7, 4, '#050505');
  c.fillEllipse(40, 36, 7, 4, '#050505');
  c.strokeLine(30, 35, 34, 35, '#27272A', 1);

  // Digital rain glints
  c.set(23, 35, '#00FF66');
  c.set(23, 36, '#00B344');
  c.set(26, 36, '#00FF66');
  c.set(39, 35, '#00FF66');
  c.set(39, 36, '#00B344');
  c.set(42, 36, '#00FF66');

  c.strokeLine(28, 50, 36, 50, '#71717A', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 17. COZY STUDY GIRL
// ==========================================
function buildCozyStudyGirl() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 28, 22, 22, '#7C2D12');
  c.fillEllipse(42, 14, 8, 10, '#9A3412');
  c.fillEllipse(44, 20, 6, 8, '#C2410C');

  c.fillEllipse(32, 38, 15, 17, '#FED7AA');
  c.fillEllipse(32, 41, 13, 14, '#FDBA74');

  c.fillPolygon([[20, 22], [24, 32], [28, 24]], '#7C2D12');
  c.fillPolygon([[28, 22], [32, 33], [36, 23]], '#7C2D12');
  c.fillPolygon([[36, 23], [40, 31], [44, 22]], '#7C2D12');

  // Retro headphones
  c.strokeEllipse(32, 26, 21, 20, '#14532D', 3);
  c.fillEllipse(14, 36, 5, 8, '#14532D');
  c.fillEllipse(14, 36, 3, 6, '#FEF08A');
  c.fillEllipse(50, 36, 5, 8, '#14532D');
  c.fillEllipse(50, 36, 3, 6, '#FEF08A');

  c.strokeLine(21, 37, 27, 39, '#7C2D12', 2);
  c.strokeLine(37, 39, 43, 37, '#7C2D12', 2);

  c.fillEllipse(20, 43, 4, 2, '#FDA4AF');
  c.fillEllipse(44, 43, 4, 2, '#FDA4AF');

  c.strokeLine(29, 49, 35, 49, '#C2410C', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 18. LATE NIGHT STUDY BOY
// ==========================================
function buildLateNightStudyBoy() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 26, 22, 20, '#0F172A');
  const spikes = [
    [[14, 22], [8, 12], [20, 16]],
    [[18, 16], [14, 6], [26, 12]],
    [[26, 12], [30, 4], [34, 12]],
    [[34, 12], [46, 6], [42, 16]],
    [[42, 16], [56, 12], [50, 22]],
    [[20, 20], [24, 32], [28, 22]],
    [[28, 22], [33, 33], [37, 23]],
    [[38, 22], [43, 31], [46, 22]]
  ];
  for (const s of spikes) {
    c.fillPolygon(s, '#1E293B');
  }

  c.fillEllipse(32, 38, 15, 17, '#E0E7FF');
  c.fillEllipse(32, 42, 13, 14, '#C7D2FE');

  // Headset
  c.strokeEllipse(32, 26, 21, 20, '#6366F1', 3);
  c.fillEllipse(14, 36, 5, 8, '#6366F1');
  c.fillEllipse(14, 36, 3, 6, '#818CF8');
  c.fillEllipse(50, 36, 5, 8, '#6366F1');
  c.fillEllipse(50, 36, 3, 6, '#818CF8');

  // Glasses
  c.strokeEllipse(24, 37, 5, 4, '#38BDF8', 1);
  c.strokeEllipse(40, 37, 5, 4, '#38BDF8', 1);
  c.strokeLine(29, 36, 35, 36, '#38BDF8', 1);

  c.fillRect(22, 36, 5, 3, '#FFFFFF');
  c.fillRect(38, 36, 5, 3, '#FFFFFF');
  c.fillRect(24, 36, 2, 3, '#0F172A');
  c.fillRect(40, 36, 2, 3, '#0F172A');
  c.set(23, 36, '#E0F2FE');
  c.set(39, 36, '#E0F2FE');

  c.strokeLine(29, 50, 35, 50, '#4338CA', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 19. PURRING WINDOW CAT
// ==========================================
function buildPurringWindowCat() {
  const c = new PixelCanvas(64, 64);
  c.fillPolygon([[12, 30], [12, 8], [26, 24]], '#F97316');
  c.fillPolygon([[14, 26], [14, 12], [23, 22]], '#FECDD3');
  c.fillPolygon([[52, 30], [52, 8], [38, 24]], '#451A03');
  c.fillPolygon([[50, 26], [50, 12], [41, 22]], '#FECDD3');

  c.fillEllipse(32, 36, 21, 20, '#FFFBEB');
  c.fillEllipse(22, 30, 11, 12, '#F97316');
  c.fillEllipse(42, 28, 10, 11, '#451A03');

  c.fillEllipse(23, 36, 6, 6, '#10B981');
  c.fillEllipse(41, 36, 6, 6, '#10B981');
  c.fillRect(23, 33, 2, 6, '#000000');
  c.fillRect(41, 33, 2, 6, '#000000');
  c.set(22, 34, '#FFFFFF');
  c.set(40, 34, '#FFFFFF');

  c.fillPolygon([[30, 44], [34, 44], [32, 47]], '#F43F5E');
  c.strokeLine(32, 47, 32, 49, '#78350F', 1);
  c.strokeLine(29, 51, 32, 49, '#78350F', 1);
  c.strokeLine(35, 51, 32, 49, '#78350F', 1);

  c.strokeLine(10, 44, 24, 45, '#FFFFFF', 1);
  c.strokeLine(10, 48, 24, 47, '#FFFFFF', 1);
  c.strokeLine(54, 44, 40, 45, '#FFFFFF', 1);
  c.strokeLine(54, 48, 40, 47, '#FFFFFF', 1);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 20. LOYAL FIREPLACE DOG
// ==========================================
function buildLoyalFireplaceDog() {
  const c = new PixelCanvas(64, 64);
  c.fillPolygon([[12, 30], [14, 8], [28, 22]], '#D97706');
  c.fillPolygon([[15, 26], [16, 12], [25, 22]], '#FEF3C7');
  c.fillPolygon([[52, 30], [50, 8], [36, 22]], '#D97706');
  c.fillPolygon([[49, 26], [48, 12], [39, 22]], '#FEF3C7');

  c.fillEllipse(32, 35, 21, 20, '#F59E0B');

  c.fillEllipse(32, 44, 15, 12, '#FFFBEB');
  c.fillEllipse(20, 40, 8, 9, '#FFFBEB');
  c.fillEllipse(44, 40, 8, 9, '#FFFBEB');

  c.fillEllipse(24, 28, 2, 2, '#FFFBEB');
  c.fillEllipse(40, 28, 2, 2, '#FFFBEB');

  c.fillEllipse(24, 34, 4, 4, '#1C1917');
  c.fillEllipse(40, 34, 4, 4, '#1C1917');
  c.set(23, 33, '#FFFFFF');
  c.set(39, 33, '#FFFFFF');

  c.fillEllipse(32, 43, 4, 3, '#000000');
  c.set(31, 42, '#FFFFFF');

  c.fillPolygon([[29, 47], [35, 47], [32, 53]], '#F43F5E');
  c.set(32, 51, '#FDA4AF');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// Map and generate all 20
const generatorMap = {
  'peter-parker': buildPeterParker,
  'bruce-wayne': buildBruceWayne,
  'tony-stark': buildTonyStark,
  'miles-morales': buildMilesMorales,
  'gwen-stacy': buildGwenStacy,
  'naruto-uzumaki': buildNarutoUzumaki,
  'gojo-satoru': buildGojoSatoru,
  'levi-ackerman': buildLeviAckerman,
  'l-lawliet': buildLLawliet,
  'elsa': buildElsa,
  'rapunzel': buildRapunzel,
  'moana': buildMoana,
  'hermione-granger': buildHermioneGranger,
  'wednesday-addams': buildWednesdayAddams,
  'officer-k': buildOfficerK,
  'neo': buildNeo,
  'cozy-study-girl': buildCozyStudyGirl,
  'late-night-study-boy': buildLateNightStudyBoy,
  'purring-window-cat': buildPurringWindowCat,
  'loyal-fireplace-dog': buildLoyalFireplaceDog
};

for (const [id, fn] of Object.entries(generatorMap)) {
  const png = fn();
  const filePath = `public/avatars/${id}.png`;
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${png.length} bytes)`);
}
console.log('Successfully generated all 20 character avatars in public/avatars/!');

// ==========================================
// 21. CLARK KENT (Superman)
// ==========================================
function buildClarkKent() {
  const c = new PixelCanvas(64, 64);
  c.fillEllipse(32, 26, 21, 20, '#09090B');
  c.fillEllipse(32, 38, 16, 18, '#F5CEB2');
  c.fillEllipse(32, 42, 14, 15, '#D4A383');

  // S-curl strand of black hair falling over forehead
  c.strokeLine(32, 20, 30, 28, '#09090B', 2);
  c.strokeLine(30, 28, 33, 31, '#09090B', 2);
  c.strokeLine(33, 31, 31, 33, '#09090B', 2);

  // Intense steel-blue eyes
  c.fillRect(21, 35, 7, 4, '#FFFFFF');
  c.fillRect(36, 35, 7, 4, '#FFFFFF');
  c.fillRect(23, 35, 3, 4, '#0284C7');
  c.fillRect(38, 35, 3, 4, '#0284C7');

  c.strokeLine(20, 33, 28, 33, '#09090B', 2);
  c.strokeLine(44, 33, 36, 33, '#09090B', 2);
  c.strokeLine(27, 49, 37, 49, '#573322', 2); // chiseled jaw

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 22. RICK SANCHEZ
// ==========================================
function buildRickSanchez() {
  const c = new PixelCanvas(64, 64);
  // Spiky pale blue hair spikes radiating all around head
  c.fillEllipse(32, 28, 24, 22, '#BAE6FD');
  const rickSpikes = [
    [[14, 20], [4, 10], [18, 14]],
    [[18, 14], [12, 4], [26, 10]],
    [[26, 10], [32, 2], [38, 10]],
    [[38, 10], [52, 4], [46, 14]],
    [[46, 14], [60, 10], [50, 20]],
    [[8, 30], [2, 22], [14, 26]],
    [[56, 30], [62, 22], [50, 26]]
  ];
  for (const s of rickSpikes) c.fillPolygon(s, '#BAE6FD');

  // Pale greyish-blue skin
  c.fillEllipse(32, 38, 15, 17, '#E2E8F0');

  // Unibrow
  c.strokeLine(21, 32, 43, 32, '#38BDF8', 2);

  // Big round manic eyes
  c.fillEllipse(24, 37, 5, 5, '#FFFFFF');
  c.fillEllipse(40, 37, 5, 5, '#FFFFFF');
  c.set(24, 37, '#000000');
  c.set(40, 37, '#000000');

  // Drool at corner of mouth
  c.strokeLine(28, 49, 36, 49, '#64748B', 2);
  c.fillEllipse(28, 52, 2, 3, '#86EFAC');

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 23. SON GOKU
// ==========================================
function buildSonGoku() {
  const c = new PixelCanvas(64, 64);
  // Massive anime hair spikes fanning out
  c.fillEllipse(32, 24, 22, 19, '#09090B');
  const gokuSpikes = [
    [[16, 20], [4, 6], [22, 14]],
    [[10, 32], [2, 20], [18, 24]],
    [[20, 14], [24, 2], [32, 10]],
    [[32, 10], [44, 2], [42, 14]],
    [[42, 14], [60, 6], [48, 20]],
    [[48, 20], [62, 20], [46, 32]]
  ];
  for (const s of gokuSpikes) c.fillPolygon(s, '#09090B');

  // Face
  c.fillEllipse(32, 38, 15, 17, '#FDE68A');
  c.fillPolygon([[20, 24], [25, 34], [29, 25]], '#09090B');
  c.fillPolygon([[35, 25], [39, 34], [44, 24]], '#09090B');

  // Determined eyes
  c.fillRect(21, 36, 7, 4, '#FFFFFF');
  c.fillRect(36, 36, 7, 4, '#FFFFFF');
  c.fillRect(24, 36, 3, 4, '#09090B');
  c.fillRect(37, 36, 3, 4, '#09090B');
  c.strokeLine(20, 34, 28, 35, '#09090B', 2);
  c.strokeLine(44, 34, 36, 35, '#09090B', 2);
  c.strokeLine(28, 50, 36, 50, '#92400E', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 24. MONKEY D LUFFY
// ==========================================
function buildLuffy() {
  const c = new PixelCanvas(64, 64);
  // Straw hat on top
  c.fillEllipse(32, 18, 26, 12, '#FDE047');
  c.fillEllipse(32, 22, 28, 6, '#EAB308');
  // Red ribbon
  c.strokeEllipse(32, 20, 22, 8, '#EF233C', 3);

  // Black hair tufts under hat
  c.fillEllipse(32, 32, 18, 16, '#09090B');
  c.fillEllipse(32, 40, 15, 16, '#FDE68A');

  // Eyes
  c.fillEllipse(23, 38, 4, 4, '#FFFFFF');
  c.fillEllipse(41, 38, 4, 4, '#FFFFFF');
  c.set(23, 38, '#000000');
  c.set(41, 38, '#000000');

  // Scar under left eye
  c.strokeLine(21, 44, 25, 44, '#78350F', 1);
  c.set(23, 43, '#78350F');
  c.set(23, 45, '#78350F');

  // Big grin
  c.strokeLine(26, 50, 38, 50, '#78350F', 2);
  c.strokeLine(27, 51, 37, 51, '#FFFFFF', 1);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 25. PIKACHU
// ==========================================
function buildPikachu() {
  const c = new PixelCanvas(64, 64);
  // Ears pointing up
  c.fillPolygon([[12, 26], [6, 4], [22, 18]], '#FACC15');
  c.fillPolygon([[7, 6], [6, 4], [13, 10]], '#000000'); // black ear tip

  c.fillPolygon([[52, 26], [58, 4], [42, 18]], '#FACC15');
  c.fillPolygon([[57, 6], [58, 4], [51, 10]], '#000000'); // black ear tip

  // Round yellow face
  c.fillEllipse(32, 36, 22, 21, '#FACC15');

  // Red cheek pouches
  c.fillEllipse(17, 43, 6, 6, '#EF233C');
  c.fillEllipse(47, 43, 6, 6, '#EF233C');

  // Big glossy black eyes
  c.fillEllipse(23, 35, 5, 5, '#000000');
  c.fillEllipse(41, 35, 5, 5, '#000000');
  c.set(22, 34, '#FFFFFF');
  c.set(40, 34, '#FFFFFF');

  // Tiny nose and cute :3 mouth
  c.set(32, 42, '#000000');
  c.strokeLine(29, 46, 32, 44, '#78350F', 1);
  c.strokeLine(35, 46, 32, 44, '#78350F', 1);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// ==========================================
// 26. CHOPPER (Tony Tony Chopper)
// ==========================================
function buildChopper() {
  const c = new PixelCanvas(64, 64);
  // Pink bucket hat on top
  c.fillEllipse(32, 22, 24, 16, '#F43F5E');
  c.fillEllipse(32, 28, 26, 8, '#FB7185');
  // White cross on hat
  c.fillRect(30, 16, 4, 12, '#FFFFFF');
  c.fillRect(26, 20, 12, 4, '#FFFFFF');

  // Reindeer fur cheeks
  c.fillEllipse(32, 39, 21, 18, '#B45309');
  c.fillEllipse(32, 44, 15, 12, '#FDE68A');

  // Big cute eyes
  c.fillEllipse(23, 37, 5, 6, '#000000');
  c.fillEllipse(41, 37, 5, 6, '#000000');
  c.set(22, 36, '#FFFFFF');
  c.set(40, 36, '#FFFFFF');

  // Iconic blue nose!
  c.fillEllipse(32, 43, 4, 3, '#0284C7');

  // Cute mouth
  c.strokeLine(30, 48, 34, 48, '#78350F', 2);

  c.finalizeArcadeSprite();
  return c.toPNG();
}

// Extra map
const extraMap = {
  'clark-kent': buildClarkKent,
  'rick-sanchez': buildRickSanchez,
  'son-goku': buildSonGoku,
  'monkey-d-luffy': buildLuffy,
  'pikachu': buildPikachu,
  'chopper': buildChopper,
  'tony-tony-chopper': buildChopper
};

for (const [id, fn] of Object.entries(extraMap)) {
  const png = fn();
  const filePath = `public/avatars/${id}.png`;
  fs.writeFileSync(filePath, png);
  console.log(`Generated extra ${filePath} (${png.length} bytes)`);
}
