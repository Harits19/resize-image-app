import { useReducer } from "react";

interface State {
  images: File[];
  currentImage?: File;
}

type Action =
  | {
      type: "setImage";
      payload: File[];
    }
  | {
      type: "deleteImage";
      payload: File;
    }
  | {
      type: "setCurrentImage";
      payload: File;
    };

export default function useImageState() {
  const reducers = (prevState: State, action: Action): State => {
    const newState: State = { ...prevState };

    const setImage = (payload: File[]) => {
      newState.images = payload;
      setFirstImage();
    };

    const setFirstImage = () => {
      if (newState.images.length === 0) return;
      newState.currentImage = newState.images[0];
    };

    const deleteImage = (payload: File) => {
      newState.images = prevState.images.filter(
        (item) => item.name !== payload.name
      );
      setFirstImage();
    };

    const setCurrentImage = (payload: File) => {
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
