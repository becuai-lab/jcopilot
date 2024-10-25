import { useEffect, useState } from 'react';

interface Interface_Debounce {
  width: number;
  height: number;
}
export const Debounce = (value: Interface_Debounce, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
