import fs from 'fs';
import zlib from 'zlib';

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

function hexToRgba(hex, alpha = 255) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b, alpha];
}

class PixelCanvas {
  constructor(w = 64, h = 64) {
    this.w = w;
    this.h = h;
    this.buf = new Uint8Array(w * h * 4);
  }

  set(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const idx = (y * this.w + x) * 4;
    const [r, g, b, a = 255] = Array.isArray(color) ? color : hexToRgba(color);
    if (a < 255 && this.buf[idx + 3] > 0) {
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

  fillRect(x, y, w, h, color) {
    for (let py = y; py < y + h; py++) {
      for (let px = x; px < x + w; px++) {
        this.set(px, py, color);
      }
    }
  }

  fillEllipse(cx, cy, rx, ry, color) {
    for (let y = cy - ry; y <= cy + ry; y++) {
      for (let x = cx - rx; x <= cx + rx; x++) {
        const d = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
        if (d <= 1.0) {
          this.set(x, y, color);
        }
      }
    }
  }

  fillPolygon(pts, color) {
    let minY = this.h, maxY = 0;
    for (const p of pts) {
      if (p[1] < minY) minY = Math.floor(p[1]);
      if (p[1] > maxY) maxY = Math.ceil(p[1]);
    }
    minY = Math.max(0, minY);
    maxY = Math.min(this.h - 1, maxY);

    for (let y = minY; y <= maxY; y++) {
      const nodeX = [];
      let j = pts.length - 1;
      for (let i = 0; i < pts.length; i++) {
        if ((pts[i][1] < y && pts[j][1] >= y) || (pts[j][1] < y && pts[i][1] >= y)) {
          nodeX.push(pts[i][0] + (y - pts[i][1]) / (pts[j][1] - pts[i][1]) * (pts[j][0] - pts[i][0]));
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

  applyPixelOutline(outlineColor = '#0A0814', thickness = 1) {
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
    const t = thickness;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (isSolid[y * this.w + x] === 0) {
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

    const [or, og, ob, oa] = hexToRgba(outlineColor, 255);
    for (const [ox, oy] of outlinePixels) {
      const idx = (oy * this.w + ox) * 4;
      this.buf[idx] = or;
      this.buf[idx + 1] = og;
      this.buf[idx + 2] = ob;
      this.buf[idx + 3] = oa;
    }
  }

  toPNG() {
    return createPNG(this.w, this.h, this.buf);
  }
}

function buildProfessorFocus() {
  const c = new PixelCanvas(64, 64);

  // 1. LAB COAT SHOULDERS & BODY
  // Open white lab coat over cyan / navy vest
  c.fillPolygon([[16, 40], [48, 40], [54, 63], [10, 63]], '#E2E8F0');
  // Lab coat inner shadow
  c.fillPolygon([[12, 54], [18, 54], [16, 63], [10, 63]], '#CBD5E1');
  c.fillPolygon([[46, 54], [52, 54], [54, 63], [48, 63]], '#CBD5E1');

  // Inner shirt / vest (Dark navy / deep cyan)
  c.fillPolygon([[24, 40], [40, 40], [42, 63], [22, 63]], '#0F172A');
  c.fillPolygon([[27, 40], [37, 40], [38, 63], [26, 63]], '#0369A1');

  // Tie (Arcade Gold with crimson stripe)
  c.fillPolygon([[30, 42], [34, 42], [35, 56], [32, 60], [29, 56]], '#F5C242');
  c.strokeLine(31, 46, 33, 46, '#E11D48', 1);
  c.strokeLine(31, 51, 33, 51, '#E11D48', 1);

  // Lab coat lapels (Crisp pure white with soft blue-gray shadow)
  c.fillPolygon([[18, 40], [25, 40], [24, 61], [18, 52]], '#FFFFFF');
  c.fillPolygon([[46, 40], [39, 40], [40, 61], [46, 52]], '#FFFFFF');
  c.strokeLine(24, 40, 23, 61, '#94A3B8', 1);
  c.strokeLine(40, 40, 41, 61, '#94A3B8', 1);

  // Pocket with pen
  c.fillRect(19, 50, 4, 1, '#94A3B8');
  c.strokeLine(20, 48, 20, 50, '#F5C242', 1);
  c.strokeLine(22, 47, 22, 50, '#38BDF8', 1);

  // 2. NECK & HEAD
  c.fillRect(28, 34, 8, 8, '#FDBA74'); // neck
  c.fillRect(29, 38, 6, 4, '#FB923C'); // neck shadow under chin

  // Head base
  c.fillEllipse(32, 23, 13, 14, '#FED7AA');
  // Jaw shape
  c.fillPolygon([[21, 23], [43, 23], [39, 35], [25, 35]], '#FED7AA');
  // Chin shadow
  c.fillPolygon([[27, 33], [37, 33], [35, 36], [29, 36]], '#FDBA74');

  // Ears
  c.fillEllipse(18, 25, 3, 4, '#FED7AA');
  c.fillEllipse(46, 25, 3, 4, '#FED7AA');
  c.fillEllipse(18, 25, 1, 2, '#FDBA74');
  c.fillEllipse(46, 25, 1, 2, '#FDBA74');

  // 3. HAIR (Distinguished Silver-Ash Brown with classic Gen 3 Professor volume)
  // Back hair volume
  c.fillEllipse(32, 14, 15, 9, '#475569');
  c.fillEllipse(32, 13, 14, 8, '#64748B');
  c.fillEllipse(32, 11, 11, 5, '#94A3B8'); // highlight

  // Sideburns & tufts
  c.fillPolygon([[17, 18], [21, 14], [20, 27], [16, 25]], '#475569');
  c.fillPolygon([[47, 18], [43, 14], [44, 27], [48, 25]], '#475569');
  // Spikes on sides
  c.fillPolygon([[15, 15], [19, 13], [16, 22]], '#64748B');
  c.fillPolygon([[49, 15], [45, 13], [48, 22]], '#64748B');

  // Forehead hair bangs
  c.fillPolygon([[20, 16], [26, 20], [24, 15]], '#475569');
  c.fillPolygon([[24, 15], [31, 21], [30, 14]], '#64748B');
  c.fillPolygon([[30, 14], [37, 20], [38, 15]], '#64748B');
  c.fillPolygon([[37, 15], [43, 19], [42, 16]], '#475569');

  // 4. FACE FEATURES
  // Eyebrows
  c.strokeLine(24, 20, 28, 20, '#334155', 2);
  c.strokeLine(36, 20, 40, 20, '#334155', 2);

  // Focus Glasses (Thin golden frames with cyan tinted glass reflections)
  // Left rim
  c.strokeLine(23, 23, 29, 23, '#F5C242', 1);
  c.strokeLine(23, 27, 29, 27, '#F5C242', 1);
  c.strokeLine(23, 23, 23, 27, '#F5C242', 1);
  c.strokeLine(29, 23, 29, 27, '#F5C242', 1);
  // Right rim
  c.strokeLine(35, 23, 41, 23, '#F5C242', 1);
  c.strokeLine(35, 27, 41, 27, '#F5C242', 1);
  c.strokeLine(35, 23, 35, 27, '#F5C242', 1);
  c.strokeLine(41, 23, 41, 27, '#F5C242', 1);
  // Bridge
  c.strokeLine(29, 24, 35, 24, '#F5C242', 1);

  // Glass reflection
  c.fillRect(24, 24, 2, 2, '#38BDF8');
  c.set(24, 24, '#FFFFFF');
  c.fillRect(36, 24, 2, 2, '#38BDF8');
  c.set(36, 24, '#FFFFFF');

  // Eyes behind glasses
  c.fillRect(26, 25, 2, 2, '#0F172A');
  c.fillRect(38, 25, 2, 2, '#0F172A');
  c.set(26, 25, '#FFFFFF');
  c.set(38, 25, '#FFFFFF');

  // Nose
  c.set(32, 27, '#F97316');
  c.set(31, 28, '#F97316');
  c.set(32, 28, '#FB923C');

  // Friendly smile
  c.strokeLine(29, 31, 35, 31, '#9A3412', 1);
  c.set(28, 30, '#9A3412');
  c.set(36, 30, '#9A3412');
  c.fillRect(30, 32, 4, 1, '#FFFFFF'); // subtle tooth sparkle

  // 5. HANDS & TABLET
  // Right hand holding digital focus data-slate
  c.fillPolygon([[45, 46], [58, 48], [56, 62], [43, 60]], '#1E293B'); // tablet back
  c.fillPolygon([[46, 48], [56, 50], [54, 60], [44, 58]], '#0284C7'); // glowing cyan screen
  // Screen wave lines (pulse)
  c.strokeLine(47, 53, 53, 53, '#5CE1E6', 1);
  c.strokeLine(49, 51, 51, 55, '#F5C242', 1);

  // Fingers holding tablet
  c.fillEllipse(44, 53, 2, 3, '#FED7AA');
  c.fillEllipse(43, 57, 2, 3, '#FED7AA');

  // Left hand gesturing forward
  c.fillEllipse(17, 47, 3, 4, '#FED7AA');
  c.set(16, 45, '#FDBA74');

  // Apply clean 1px retro dark outline around entire silhouette
  c.applyPixelOutline('#090714', 1);

  return c.toPNG();
}

const professorPNG = buildProfessorFocus();
fs.writeFileSync('public/avatars/professor-focus.png', professorPNG);
console.log(`Generated public/avatars/professor-focus.png (${professorPNG.length} bytes)`);
