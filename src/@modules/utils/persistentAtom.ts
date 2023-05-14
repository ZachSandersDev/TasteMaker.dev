import { AtomOptions } from "recoil";
import { atom } from "recoil";


export default function persistentAtom<T>(options: AtomOptions<T> & { default: T }, persistKey: string, dataKey: keyof T) {
  return atom({
    ...options,
    default: {
      ...options.default,
      // @ts-expect-error Something about overly complex union type
      [dataKey]: JSON.parse(localStorage.getItem(persistKey) || "0") || options.default[dataKey]
    },
    effects: [
      ...options.effects || [],
      ({
        onSet
      }) => {
        onSet((newValue) => {
          if (!newValue[dataKey]) {
            localStorage.removeItem(persistKey);
          } else {
            localStorage.setItem(persistKey, JSON.stringify(newValue[dataKey]));
          }
        });
      }
    ]
  });
}
