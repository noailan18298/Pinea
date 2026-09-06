import { createContext, useContext } from "react";

const SlideModeContext = createContext(false);

export const SlideModeProvider = SlideModeContext.Provider;

export function useSlideMode() {
  return useContext(SlideModeContext);
}
