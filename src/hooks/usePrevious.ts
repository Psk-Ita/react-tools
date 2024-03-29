import { useEffect, useRef } from "react";

export const usePrevious = <T>(value?: T): T | undefined => {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/* usage
    // selector, props, components state
    const currentValue = useSelector(...) ;
    const previousValue = usePrevious(currentValue);

    useEffect(() => {
      // standard or custom equality comparer
      if(currentValue !== previousValue){
        // code to execute when currentValue changes
      }
    }, [currentValue, previousValue]);
*/
