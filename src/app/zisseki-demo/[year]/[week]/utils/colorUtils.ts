/**
 * 色の明度を計算して、適切なテキスト色を返すユーティリティ関数
 */

/**
 * HEXカラーコードをRGBに変換
 * @param hex - HEXカラーコード（例: "#3788d8" または "#38d"）
 * @returns RGB値のオブジェクト
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // "#" を除去
  const cleanHex = hex.replace('#', '');
  
  // 3桁の短縮形を6桁に展開
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * RGB値から相対輝度を計算（WCAG 2.0基準）
 * @param r - 赤（0-255）
 * @param g - 緑（0-255）
 * @param b - 青（0-255）
 * @returns 相対輝度（0-1）
 */
export function getLuminance(r: number, g: number, b: number): number {
  // RGB値を0-1の範囲に正規化
  const [rs, gs, bs] = [r, g, b].map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  
  // 相対輝度を計算
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 背景色に基づいて適切なテキスト色を返す
 * @param backgroundColor - 背景色のHEXコード
 * @param darkColor - 薄い背景の場合に使用する濃い色（デフォルト: 彩度を最大化した色）
 * @param lightColor - 濃い背景の場合に使用する明るい色（デフォルト: 白）
 * @returns 適切なテキスト色
 */
export function getContrastTextColor(
  backgroundColor: string,
  darkColor?: string,
  lightColor: string = '#FFFFFF'
): string {
  const rgb = hexToRgb(backgroundColor);
  
  if (!rgb) {
    return lightColor; // パースに失敗した場合は白を返す
  }
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  // 輝度が0.5以上（薄い色）の場合は彩度を最大化した色を使用
  if (luminance > 0.5) {
    // darkColorが指定されていない場合は、背景色の彩度を最大化
    if (!darkColor) {
      return saturateColor(backgroundColor);
    }
    return darkColor;
  }
  
  // 輝度が0.5未満（濃い色）の場合は明るい色を使用
  return lightColor;
}

/**
 * 色を暗くする
 * @param hex - HEXカラーコード
 * @param factor - 暗くする割合（0-1、0で真っ黒、1で元の色）
 * @returns 暗くした色のHEXコード
 */
export function darkenColor(hex: string, factor: number = 0.7): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    return '#000000';
  }
  
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 色を明るくする
 * @param hex - HEXカラーコード
 * @param factor - 明るくする割合（0-1、0で元の色、1で真っ白）
 * @returns 明るくした色のHEXコード
 */
export function lightenColor(hex: string, factor: number = 0.3): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    return '#FFFFFF';
  }
  
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * RGB値をHSL（色相・彩度・輝度）に変換
 * @param r - 赤（0-255）
 * @param g - 緑（0-255）
 * @param b - 青（0-255）
 * @returns HSL値のオブジェクト（h: 0-360, s: 0-100, l: 0-100）
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * HSL値をRGBに変換
 * @param h - 色相（0-360）
 * @param s - 彩度（0-100）
 * @param l - 輝度（0-100）
 * @returns RGB値のオブジェクト
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * 色の彩度を最大化する（彩度100%にする）
 * @param hex - HEXカラーコード
 * @returns 彩度を最大化した色のHEXコード
 */
export function saturateColor(hex: string): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    return '#000000';
  }
  
  // RGBをHSLに変換
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // 彩度を100%に、輝度を40%に設定（より濃い色にする）
  const saturatedRgb = hslToRgb(hsl.h, 100, 40);
  
  return `#${saturatedRgb.r.toString(16).padStart(2, '0')}${saturatedRgb.g.toString(16).padStart(2, '0')}${saturatedRgb.b.toString(16).padStart(2, '0')}`;
}

