export default function useUpdater<T>(
  value: T | undefined | null,
  setValue: (newVal: T) => void
) {
  return function (update: (currentVal: T) => unknown) {
    if (value === undefined || value === null) {
      throw "Original value has not been loaded yet";
    }

    const newValue = structuredClone(value);
    update(newValue);
    setValue(newValue);
  };
}
