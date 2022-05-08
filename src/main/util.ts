import { URL } from 'url';
import path from 'path';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash-es';
import _ from 'lodash';

/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

/** Return subset of a typed object given another typed object */
// const newMember = subset<Member>(
//   member,
//   "Member_ID",
//   // 'Panelist_ID',
//   "Name_Given",
//   "Name_Family",
//   "Date_Of_Birth",
//   "Year_Of_Birth",
//   "Age",
//   "Gender",
//   "Life_Status",
//   "Address_Suburb",
//   "Address_State",
//   "Address_Region",
//   "Address_Postal_Code",
//   "Phone_Home",
//   "Phone_Mobile",
//   "Email"
// )
export function subset<T>(obj: T, ...keys: (keyof T)[]) {
  const result = {} as T;

  keys.forEach(key => result[key] = obj[key]);
  return result;
}

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
};