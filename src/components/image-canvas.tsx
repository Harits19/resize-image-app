import { useEffect, useRef } from "react";
import {
  downloadBlob,
  drawImage,
  getBlobData,
} from "../utils/file-util";
import { ImageModel } from "../models/image-model";
import Button from "./button";
import useDebounceValue from "../hooks/use-debounce-value";

export interface ImageCanvasRefProps extends HTMLCanvasElement {
  getBlobData: () => Promise<{ blob?: Blob; filename?: string }>;
}

export default function ImageCanvas({
  value,
  ratio,
  show = true,
  backgroundColor,
}: {
  value: ImageModel;
  ratio: {
    width: number;
    height: number;
  };
  show?: boolean;
  backgroundColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgroundColorDebounce = useDebounceValue(backgroundColor);

  useEffect(() => {
    drawImage({
      ratio,
      src: value.url,
      backgroundColorDebounce,
      canvasRef: canvasRef.current ?? undefined,
    });
  }, [backgroundColorDebounce, ratio, ratio.height, ratio.width, value.url]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.log("canvas is undefined");

      return;
    }

    const blobData = await getBlobData({
      canvas: canvasRef.current,
      ratio,
      value,
    });

    downloadBlob(blobData);
  };

  return (
    <div className={`h-full w-full absolute ${show ? "" : "opacity-0 hidden"}`}>
      <canvas
        className="w-full h-full object-contain absolute "
        ref={canvasRef}
      ></canvas>
      <div className="absolute w-full flex flex-row items-center justify-center bottom-0 p-4 z-50">
        <Button className=" border-white border w-min" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
}
