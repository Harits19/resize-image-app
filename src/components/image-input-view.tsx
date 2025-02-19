import { useRef } from "react";
import { RiImageAddFill } from "react-icons/ri";

export default function ImageInputView({
  onChange,
  files,
}: {
  onChange: (files: File[]) => void;
  files: File[];
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleOnClickArea = () => {
    imageInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files);
    const filteredFiles = droppedFiles.filter((item) => item.type.startsWith("image/"))

    onChange([...files, ...filteredFiles]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <button
      className="w-full h-full"
      onClick={handleOnClickArea}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
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
          onChange(newImages);
        }}
      />
      <div className={` flex flex-col items-center justify-center `}>
        <RiImageAddFill className="text-[60px] text-center" />
        <div>Tarik Gambarmu Kesini</div>
      </div>
    </button>
  );
}
