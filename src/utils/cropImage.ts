export interface CropPixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the image."));
    image.src = src;
  });
}

/**
 * Crops an image to the given pixel area (as reported by react-easy-crop)
 * and rasterizes it to a square blob at a fixed output size, matching how
 * WhatsApp/Instagram-style avatar croppers export a flat square regardless
 * of the source photo's resolution.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  cropArea: CropPixelArea,
  outputSize = 512,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create a canvas context.");
  }

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not export the cropped image."));
        }
      },
      "image/webp",
      0.9,
    );
  });
}
