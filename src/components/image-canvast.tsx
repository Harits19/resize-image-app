import { useEffect, useRef, useState } from "react";
import { getFilenameWithoutExtension, smallestRatio } from "../utils/file-util";

export default function ImageCanvas({
  value,
  ratio,
}: {
  value: File;
  ratio: {
    width: number;
    height: number;
  };
}) {
  const canvasAspectRatio = ratio.width / ratio.height;
  const src = useRef(URL.createObjectURL(value)).current;

  const containerRef = useRef<HTMLDivElement>(null);

  const imageFile = getFilenameWithoutExtension(value.name);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!containerRef) {
      console.log("container ref is undefined");

      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log("image undefined");

        return;
      }
      setImage(img);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.log("canvas context undefined");

        return;
      }

      const imageWidth = img.width;
      const imageHeight = img.height;
      const containerWidth = containerRef.current?.offsetWidth;
      const containerHeight = containerRef.current?.offsetHeight;

      if (!containerHeight || !containerWidth) {
        console.log("container size is undefined");
        return;
      }

      console.log({ imageWidth, imageHeight, containerWidth, containerHeight });

      const imageAspectRatio = imageWidth / imageHeight;

      let canvasWidth = 1,
        canvasHeight = 1;

      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than the canvas aspect ratio, so width is the limiting factor
        canvasWidth = imageWidth;
        canvasHeight = canvasWidth / canvasAspectRatio;
      } else {
        // Image is taller than or equal to the canvas aspect ratio, so height is the limiting factor
        canvasHeight = imageHeight;
        canvasWidth = canvasHeight * canvasAspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.fillStyle = "black"; // Default to transparent if not provided
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = (canvasWidth - imageWidth) / 2;
      const centerY = (canvasHeight - imageHeight) / 2;

      // 2. Draw the image (now on top of the background)
      ctx.drawImage(img, centerX, centerY);
    };
  }, [src, canvasAspectRatio]);

  const handleDownload = () => {
    if (image) {
      const canvas = canvasRef.current;

      if (!canvas) {
        console.log("canvas is undefined");

        return;
      }

      // Method 1: Using toBlob (Recommended for most cases)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const ratioText = smallestRatio(ratio.width, ratio.height).replace(
            ":",
            "x"
          );
          a.href = url;
          a.download = `${imageFile} ${ratioText}.jpeg`; // Set the filename
          document.body.appendChild(a); // Required for Firefox
          a.click();
          document.body.removeChild(a); // Clean up
          URL.revokeObjectURL(url); // Release memory
        } else {
          console.error("Failed to create blob.");
        }
      }, "image/jpeg"); // Specify image type (PNG is lossless)
    }
  };

  return (
    <div ref={containerRef} className="h-full w-full absolute">
      <canvas
        className="w-full h-full object-contain absolute "
        ref={canvasRef}
      ></canvas>
      <button className="absolute bg-white" onClick={handleDownload}>
        Download
      </button>
   
    </div>
  );
}
