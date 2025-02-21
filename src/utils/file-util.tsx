import { ImageModel } from "../models/image-model";
import { RatioModel } from "../models/ratio-model";

export function smallestRatio(size1: number, size2: number): string {
  if (size1 === 0 && size2 === 0) {
    return "Undefined ratio (0:0)";
  } else if (size1 === 0) {
    return "0:1";
  } else if (size2 === 0) {
    return "1:0";
  }

  function gcd(a: number, b: number): number {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  const commonDivisor: number = gcd(size1, size2);

  const simplifiedSize1: number = size1 / commonDivisor;
  const simplifiedSize2: number = size2 / commonDivisor;

  return `${simplifiedSize1}:${simplifiedSize2}`;
}

export function getFilenameWithoutExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename;
  } else {
    return filename.substring(0, lastDotIndex);
  }
}

export function downloadBlob({
  blob,
  filename,
}: {
  blob?: Blob;
  filename?: string;
}) {
  if (!blob) {
    console.log("blob data is empty");

    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename ?? "Empty name";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function drawImage({
  src,
  ratio,
  backgroundColorDebounce,
  canvasRef,
}: {
  src: string;
  ratio: RatioModel;
  backgroundColorDebounce?: string;
  canvasRef?: HTMLCanvasElement;
}) {
  const img = new Image();
  img.src = src;

  const updateCanvas = () =>
    new Promise<HTMLCanvasElement | OffscreenCanvas>(
      (resolve) =>
        (img.onload = () => {
          const canvas = canvasRef ?? new OffscreenCanvas(200, 200);
          if (!canvas) {
            console.log("image undefined");

            return;
          }

          const imageWidth = img.width;
          const imageHeight = img.height;

          const imageAspectRatio = imageWidth / imageHeight;

          let canvasWidth = 1,
            canvasHeight = 1;

          const canvasAspectRatio = ratio.width / ratio.height;

          if (imageAspectRatio > canvasAspectRatio) {
            canvasWidth = imageWidth;
            canvasHeight = canvasWidth / canvasAspectRatio;
          } else {
            canvasHeight = imageHeight;
            canvasWidth = canvasHeight * canvasAspectRatio;
          }

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          if (canvas instanceof OffscreenCanvas) {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              console.log("canvas context undefined");

              return;
            }
            ctx.fillStyle = backgroundColorDebounce || "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const centerX = (canvasWidth - imageWidth) / 2;
            const centerY = (canvasHeight - imageHeight) / 2;

            ctx.drawImage(img, centerX, centerY);
          } else {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              console.log("canvas context undefined");

              return;
            }
            ctx.fillStyle = backgroundColorDebounce || "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const centerX = (canvasWidth - imageWidth) / 2;
            const centerY = (canvasHeight - imageHeight) / 2;

            ctx.drawImage(img, centerX, centerY);
          }
          resolve(canvas);
        })
    );

  const newCanvas = await updateCanvas();

  return newCanvas;
}

export const getBlobData = async ({
  canvas,
  value,
  ratio,
}: {
  canvas: null | OffscreenCanvas | HTMLCanvasElement;
  value: ImageModel;
  ratio: RatioModel;
}) => {
  if (!canvas) {
    console.log("canvas is undefined");

    return {
      filename: undefined,
    };
  }

  const type = "image/jpeg";

  const blob =
    canvas instanceof OffscreenCanvas
      ? await canvas.convertToBlob({ type })
      : (await new Promise<Blob | null>((resolve) => {
          return canvas.toBlob((blob) => resolve(blob), type);
        })) ?? undefined;

  const imageFile = getFilenameWithoutExtension(value.file.name);
  const ratioText = smallestRatio(ratio.width, ratio.height).replace(":", "x");

  const filename = `${imageFile} ${ratioText}.jpeg`;

  return {
    blob,
    filename,
  };
};
