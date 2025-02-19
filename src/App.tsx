import { RiImageAddFill } from "react-icons/ri";
import BaseContainer from "./components/base-container";
import { useRef, useState } from "react";
import { createObjectURL, smallestRatio } from "./utils/file-util";
import useBeforeUnload from "./hooks/use-before-unload";
import { RatioModel } from "./models/ratio-model";
import ImageCanvas from "./components/image-canvast";
import { IoIosCloseCircle } from "react-icons/io";
import useImageState from "./hooks/use-image-state";

function App() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { dispatch, currentImage, images } = useImageState();

  console.log("re render App page");

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

  const handleOnClickArea = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="h-screen w-screen bg-blue-50 flex flex-col overflow-hidden">
      <div className="w-full shadow-lg p-4">
        <h1 className="">Image Resizer (for instagram)</h1>
      </div>
      <div className="h-full w-full flex flex-row p-8 gap-x-4">
        <BaseContainer>
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
        </BaseContainer>
        <BaseContainer className="flex-1 flex flex-col">
          <div className="border w-full border-dashed flex flex-col items-center justify-center text-center h-full rounded-lg text-gray-500 relative">
            <button className="w-full h-full" onClick={handleOnClickArea}>
              <input
                ref={imageInputRef}
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const newImages = Array.from(e.target.files ?? []);
                  if (newImages.length === 0) {
                    console.log("No Image Selected");
                    return;
                  }
                  dispatch({ type: "setImage", payload: newImages });
                }}
              />
              <div
                className={`${
                  currentImage ? "opacity-0" : ""
                } flex flex-col items-center justify-center `}
              >
                <RiImageAddFill className="text-[60px] text-center" />
                <div>Tarik Gambarmu Kesini</div>
              </div>
            </button>

            {currentImage && (
              <ImageCanvas
                key={currentImage.name}
                value={currentImage}
                ratio={currentRatio}
              />
            )}
          </div>
          <div className="flex flex-col w-full h-auto overflow-x-scroll mt-4 no-scrollbar overflow-y-hidden ">
            <div className="flex flex-row w-max gap-x-2 bg-green-50">
              {images.map((item) => {
                const src = createObjectURL(item);
                return (
                  <div
                    className="bg-gray-400 w-[160px] h-[90px] cursor-grab relative"
                    key={item.name}
                  >
                    <button
                      className="w-full h-full object-contain absolute"
                      onClick={() => {
                        dispatch({ type: "setCurrentImage", payload: item });
                      }}
                    >
                      <img
                        className="w-full h-full object-contain "
                        src={src}
                        key={item.name}
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
        </BaseContainer>
      </div>
    </div>
  );
}

export default App;
