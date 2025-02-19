import { useEffect, useState } from "react";

export default function useDebounceValue<T>(value: T) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setState(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return state;
}
