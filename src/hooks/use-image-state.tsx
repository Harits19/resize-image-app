import { useReducer } from "react";
import { ImageModel } from "../models/image-model";

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
  const reducers = (prevState: State, action: Action): State => {
    const newState: State = { ...prevState };

    const setImage = (payload: File[]) => {
      newState.images = payload.map((item) => new ImageModel(item));
      setFirstImage();
    };

    const setFirstImage = () => {
      if (newState.images.length === 0) return;
      newState.currentImage = newState.images[0];
    };

    const deleteImage = (payload: ImageModel) => {
      newState.images = prevState.images.filter(
        (item) => item.file.name !== payload.file.name
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

  return { images, currentImage, dispatch };
}
