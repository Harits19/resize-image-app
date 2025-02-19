import { useEffect, useRef } from "react";
import { getFilenameWithoutExtension, smallestRatio } from "../utils/file-util";
import { ImageModel } from "../models/image-model";
import Button from "./button";

export interface ImageCanvasRefProps extends HTMLCanvasElement {
  getBlobData: () => Promise<{ blob?: Blob; filename?: string }>;
}

export default function ImageCanvas({
  value,
  ratio,
  show = true,
  setRef,
}: {
  value: ImageModel;
  ratio: {
    width: number;
    height: number;
  };
  show?: boolean;
  setRef: (value: ImageCanvasRefProps) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    setRef({
      ...canvasRef.current,
      getBlobData,
    });
  }, []);

  useEffect(() => {
    const img = new Image();
    const src = value.url;
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log("image undefined");

        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.log("canvas context undefined");

        return;
      }

      const imageWidth = img.width;
      const imageHeight = img.height;

      const imageAspectRatio = imageWidth / imageHeight;

      let canvasWidth = 1,
        canvasHeight = 1;

      const canvasAspectRatio = ratio.width / ratio.height;

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
  }, [ratio.height, ratio.width, value.url]);

  const getBlobData = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.log("canvas is undefined");

      return {
        blob: undefined,
        filename: undefined,
      };
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    ) ?? undefined; 
    const imageFile = getFilenameWithoutExtension(value.file.name);
    const ratioText = smallestRatio(ratio.width, ratio.height).replace(
      ":",
      "x"
    );

    const filename = `${imageFile} ${ratioText}.jpeg`;

    return {
      blob,
      filename,
    };
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.log("canvas is undefined");

      return;
    }

    const { blob, filename } = await getBlobData();

    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = filename; // Set the filename
      document.body.appendChild(a); // Required for Firefox
      a.click();
      document.body.removeChild(a); // Clean up
      URL.revokeObjectURL(url); // Release memory
    } else {
      console.error("Failed to create blob.");
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
        const imageFile = getFilenameWithoutExtension(value.file.name);
        a.download = `${imageFile} ${ratioText}.jpeg`; // Set the filename
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release memory
      } else {
        console.error("Failed to create blob.");
      }
    }, "image/jpeg"); // Specify image type (PNG is lossless)
  };

  return (
    <div className={`h-full w-full absolute ${show ? "" : "opacity-0 hidden"}`}>
      <canvas
        className="w-full h-full object-contain absolute "
        ref={canvasRef}
      ></canvas>
      <div className="absolute w-full flex flex-row items-center justify-center bottom-0 p-4">
        <Button className=" border-white border w-min" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
}
