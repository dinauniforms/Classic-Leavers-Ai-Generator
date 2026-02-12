/**
 * Generates a tinted jersey image with a logo overlay
 */
export async function generateJerseyImage(
  baseImageUrl: string,
  colorHexes: string[],
  logoUrl: string | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('No context');

    const baseImg = new Image();
    // No crossOrigin needed for local files, but kept for robustness
    baseImg.crossOrigin = "anonymous";
    baseImg.src = baseImageUrl;

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      // 1. Draw base jersey
      ctx.drawImage(baseImg, 0, 0);

      // 2. Apply primary color tint
      if (colorHexes.length > 0) {
        // We use a temporary canvas to create the tint mask
        const tintCanvas = document.createElement('canvas');
        tintCanvas.width = canvas.width;
        tintCanvas.height = canvas.height;
        const tintCtx = tintCanvas.getContext('2d');
        
        if (tintCtx) {
          tintCtx.fillStyle = colorHexes[0];
          tintCtx.fillRect(0, 0, canvas.width, canvas.height);
          tintCtx.globalCompositeOperation = 'destination-atop';
          tintCtx.drawImage(baseImg, 0, 0);

          // Blend the tint with the original to keep textures
          ctx.globalAlpha = 0.7; // Adjust for intensity
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(tintCanvas, 0, 0);
          ctx.globalAlpha = 1.0;
        }
      }

      // 3. Draw Logo Overlay
      if (logoUrl) {
        const logoImg = new Image();
        logoImg.src = logoUrl;
        logoImg.onload = () => {
          ctx.globalCompositeOperation = 'source-over';
          
          // Position logo on "Right Chest" (relative to viewer's left)
          const logoWidth = canvas.width * 0.10;
          const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
          const posX = canvas.width * 0.31;
          const posY = canvas.height * 0.36;
          
          // Subtle glow/backing
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(0,0,0,0.1)';
          
          ctx.drawImage(logoImg, posX, posY, logoWidth, logoHeight);
          resolve(canvas.toDataURL('image/png', 1.0));
        };
        logoImg.onerror = () => resolve(canvas.toDataURL('image/png', 1.0));
      } else {
        resolve(canvas.toDataURL('image/png', 1.0));
      }
    };
    baseImg.onerror = (err) => {
      console.error("Image failed to load. Ensure filenames match exactly.", err);
      reject("Image loading failed.");
    };
  });
}