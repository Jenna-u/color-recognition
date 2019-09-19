import Taro from '@tarojs/taro'

export function createPixelArray(imgData, pixelCount, quality) {
  const pixels = imgData;
  const pixelArray = [];

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];

      // If pixel is mostly opaque and not white
      if (typeof a === 'undefined' || a >= 125) {
          if (!(r > 255 && g > 255 && b > 255)) {
              pixelArray.push([r, g, b]);
          }
      }
  }
  return pixelArray;
}

export function rgbToHex(rgb) {
  return ((rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).padStart(6, '0');
}

export function showToast(obj) {
  return Taro.showToast(obj)
}

export function hideToast() {
  return Taro.hideToast()
}