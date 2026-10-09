/**
 * Utility to convert SVG strings or SVG data URLs to clean raster PNG data URLs
 * Gemini API strictly supports raster images (image/png, image/jpeg, image/webp)
 * and does not support image/svg+xml.
 */
export async function svgToPngDataUrl(
  svgContentOrUrl: string,
  width = 600,
  height = 600
): Promise<string> {
  return new Promise((resolve, reject) => {
    let svgUrl = svgContentOrUrl;
    let shouldRevoke = false;

    if (!svgContentOrUrl.startsWith('data:')) {
      const blob = new Blob([svgContentOrUrl], { type: 'image/svg+xml;charset=utf-8' });
      svgUrl = URL.createObjectURL(blob);
      shouldRevoke = true;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (shouldRevoke) URL.revokeObjectURL(svgUrl);
          reject(new Error('Canvas 2D context is not available'));
          return;
        }

        // Fill clean white background for transparency handling in sketches
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw the SVG image centered
        ctx.drawImage(img, 0, 0, width, height);

        const pngDataUrl = canvas.toDataURL('image/png');
        if (shouldRevoke) URL.revokeObjectURL(svgUrl);
        resolve(pngDataUrl);
      } catch (err) {
        if (shouldRevoke) URL.revokeObjectURL(svgUrl);
        reject(err);
      }
    };

    img.onerror = (e) => {
      if (shouldRevoke) URL.revokeObjectURL(svgUrl);
      reject(new Error('Failed to render SVG onto canvas'));
    };

    img.src = svgUrl;
  });
}

/**
 * Ensures any image data URL (including uploaded SVGs) is converted to
 * a Gemini-compatible raster format (image/png or image/jpeg).
 */
export async function prepareImageForAnalysis(
  dataUrl: string,
  mimeType: string
): Promise<{ base64DataUrl: string; mimeType: string }> {
  if (mimeType === 'image/svg+xml' || dataUrl.startsWith('data:image/svg+xml')) {
    const pngUrl = await svgToPngDataUrl(dataUrl);
    return {
      base64DataUrl: pngUrl,
      mimeType: 'image/png',
    };
  }

  // Already a raster image (jpeg, png, webp)
  return {
    base64DataUrl: dataUrl,
    mimeType: mimeType || 'image/jpeg',
  };
}
