import { useReducer, useRef } from "react";
import { ImageModel } from "../models/image-model";
import { ImageCanvasRefProps } from "../components/image-canvas";

interface State {
  images: ImageModel[];
  currentImage?: ImageModel;
}

type Action =
  | {
      type: "setImage";
      payload: File[];
    }
  | {
      type: "deleteImage";
      payload: ImageModel;
    }
  | {
      type: "setCurrentImage";
      payload: ImageModel;
    };

export default function useImageState() {
  const refs = useRef<(ImageCanvasRefProps | null)[]>([]);
  const reducers = (prevState: State, action: Action): State => {
    const newState: State = { ...prevState };

    const setImage = (payload: File[]) => {
      newState.images = payload.map((item) => new ImageModel(item));
      setFirstImage();
    };

    const setFirstImage = () => {
      if (newState.images.length === 0) {
        newState.currentImage = undefined;

        return;
      }
      newState.currentImage = newState.images[0];
    };

    const deleteImage = (payload: ImageModel) => {
      newState.images = prevState.images.filter(
        (item) => item.url !== payload.url
      );
      setFirstImage();
    };

    const setCurrentImage = (payload: ImageModel) => {
      newState.currentImage = payload;
    };

    switch (action.type) {
      case "setImage":
        setImage(action.payload);
        break;
      case "deleteImage":
        deleteImage(action.payload);
        break;
      case "setCurrentImage":
        setCurrentImage(action.payload);
        break;
      default:
        break;
    }

    return newState;
  };

  const [{ images, currentImage }, dispatch] = useReducer(reducers, {
    images: [],
  });

  return { images, currentImage, dispatch, refs };
}
