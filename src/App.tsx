import BaseContainer from "./components/base-container";
import { useState } from "react";
import { downloadBlob, smallestRatio } from "./utils/file-util";
import useBeforeUnload from "./hooks/use-before-unload";
import { RatioModel } from "./models/ratio-model";
import ImageCanvas from "./components/image-canvas";
import { IoIosCloseCircle } from "react-icons/io";
import useImageState from "./hooks/use-image-state";
import Button from "./components/button";
import JSZip from "jszip";
import ImageInputView from "./components/image-input-view";

function App() {
  const [backgroundColor, setBackgroundColor] = useState("#00000");
  const { dispatch, currentImage, images, refs } = useImageState();
  const [loadingAll, setLoadingAll] = useState(false);

  const listImageRatio: RatioModel[] = [
    {
      height: 10,
      width: 10,
    },
    {
      height: 15,
      width: 12,
    },
    {
      height: 9,
      width: 16,
    },
  ] as const;

  const [currentRatio, setCurrentRatio] = useState<RatioModel>(
    listImageRatio[0]
  );

  useBeforeUnload();

  const handleDownloadAll = async () => {
    setLoadingAll(true);
    const zip = new JSZip();

    for (const item of refs.current) {
      if (!item) continue;
      const { blob, filename } = await item.getBlobData();

      if (!filename || !blob) continue;

      zip.file(`${filename}`, blob, { binary: true });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const ratioText = smallestRatio(
      currentRatio.width,
      currentRatio.height
    ).replace(":", "x");

    downloadBlob({ blob: zipBlob, filename: `Size ${ratioText}.zip` });
    setLoadingAll(false);
  };

  return (
    <div className="h-screen w-screen bg-blue-50 flex flex-col overflow-hidden">
      <div className="w-full shadow-lg p-4">
        <h1 className="">Image Resizer (for instagram)</h1>
      </div>
      <div className="h-full w-full flex flex-row p-8 gap-x-4">
        <BaseContainer className="flex flex-col">
          <span>Image Ratio</span>
          <div className="h-8" />
          <div className="flex flex-col gap-y-2 w-full items-center">
            {listImageRatio.map((item) => {
              const { height, width } = item;
              const isSelected =
                height === currentRatio.height && width === currentRatio.width;
              const key = `${height}-${width}`;

              const size = 12;

              const newWidth = width * size;
              const newHeight = height * size;

              const text = smallestRatio(width, height);

              return (
                <button
                  key={key}
                  className={`border flex flex-col items-center justify-center ${
                    isSelected ? "border-blue-400 text-blue-400" : ""
                  } `}
                  style={{
                    height: newHeight,
                    width: newWidth,
                  }}
                  onClick={() => {
                    setCurrentRatio(item);
                  }}
                >
                  {text}
                </button>
              );
            })}
          </div>
          <div className="h-8" />
          <span>Background Color</span>
          <div className="h-2" />
          <input
            className="w-full h-12"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />

          <div className="flex flex-1" />
          {images.length > 0 && (
            <>
              <Button loading={loadingAll} onClick={handleDownloadAll}>
                Download All
              </Button>
              <div className="h-4" />
              <Button
                onClick={() => {
                  dispatch({ type: "setImage", payload: [] });
                }}
              >
                Delete All
              </Button>
            </>
          )}
        </BaseContainer>
        <BaseContainer className="flex-1 flex flex-col">
          {currentImage?.file.name}
          <div className="border w-full border-dashed flex flex-col items-center justify-center text-center h-full rounded-lg text-gray-500 relative">
            {images.map((item, index) => {
              return (
                <ImageCanvas
                  backgroundColor={backgroundColor}
                  setRef={(value) => (refs.current[index] = value)}
                  key={item.url}
                  value={item}
                  ratio={currentRatio}
                  show={item.file.name === currentImage?.file.name}
                />
              );
            })}
            <div
              className={`absolute w-full h-full ${
                images.length > 0 ? "opacity-0" : ""
              }`}
            >
              <ImageInputView
                files={images.map((item) => item.file)}
                onChange={(newImages) =>
                  dispatch({ type: "setImage", payload: newImages })
                }
              />
            </div>
          </div>
          {images.length > 0 && (
            <div className="flex flex-col w-full  h-[90px] overflow-x-scroll mt-4 no-scrollbar ">
              <div className="flex flex-row w-max h-full gap-x-2 bg-green-50">
                {images.map((item) => {
                  const isSelected = item.file.name === currentImage?.file.name;
                  return (
                    <div
                      className={`bg-gray-400 w-[160px] h-full cursor-grab relative ${
                        isSelected ? " border-blue-500 border-2" : ""
                      }`}
                      key={item.url}
                    >
                      <button
                        className="w-full h-full object-contain absolute"
                        onClick={() => {
                          dispatch({ type: "setCurrentImage", payload: item });
                        }}
                      >
                        <img
                          className="w-full h-full object-contain "
                          src={item.url}
                          key={item.url}
                        />
                      </button>
                      <button
                        className="absolute right-0 p-1"
                        onClick={() => {
                          dispatch({ type: "deleteImage", payload: item });
                        }}
                      >
                        <IoIosCloseCircle className="text-[24px] text-black shadow-lg border-white  rounded-full overflow-hidden border" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </BaseContainer>
      </div>
    </div>
  );
}

export default App;
