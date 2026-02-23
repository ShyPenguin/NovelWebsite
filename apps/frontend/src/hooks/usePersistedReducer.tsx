import { useReducer, useEffect } from "react";

export const usePersistedReducer = <T, A>(
  reducer: (state: T, action: A) => T,
  initialState: T,
  storageKey: string
) => {
  // Initialize state from localStorage or use initialState
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error);
      return initialState;
    }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${storageKey}":`, error);
    }
  }, [state, storageKey]);

  return [state, dispatch] as const;
};
