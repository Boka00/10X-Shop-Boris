import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
 
  const [debauncedValue, setDebauncedValue] = useState<T>(value)

  useEffect(()=>{
    const timer = setTimeout(() => {
        setDebauncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay])

  return debauncedValue;
}