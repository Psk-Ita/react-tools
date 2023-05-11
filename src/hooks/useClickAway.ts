import { RefObject, useEffect } from "react";

export interface ClickAwayHooksProps {
  refElement: RefObject<any>;
  onClickAway: (ev: Event) => void;
}

export const useClickAwayHooks = ({
  refElement,
  onClickAway,
}: ClickAwayHooksProps): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // execute the ClickAway method when mouse event is raised outside the element
      if (refElement.current && !refElement.current.contains(event.target)) {
        onClickAway(event);
      }
    };

    const handleKeyDownOutside = (event: KeyboardEvent): void => {
      // execute the ClickAway method when mouse event is raised outside the element
      if (refElement.current && !refElement.current.contains(event.target)) {
        onClickAway(event);
      }
    };

    document.addEventListener("keydown", handleKeyDownOutside, false);
    document.addEventListener("mousedown", handleClickOutside, false);

    return () => {
      document.removeEventListener("keydown", handleKeyDownOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refElement, onClickAway]);
};
