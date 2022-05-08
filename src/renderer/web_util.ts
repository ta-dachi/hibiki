import _ from "lodash";
import { useCallback, useState } from "react";

export const useDebounce = (obj: any = null, wait: number = 1000) => {
  const [state, setState] = useState(obj);

  const setDebouncedState = (_val: any) => {
    _debounce(_val);
  };

  const _debounce = useCallback(
    _.debounce((_prop: string) => {
      console.log("updating search");
      setState(_prop);
    }, wait),
    []
  );

  return [state, setDebouncedState];
}