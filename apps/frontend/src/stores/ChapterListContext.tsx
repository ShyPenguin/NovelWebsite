import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

type ChapterPageState = {
  currentPage: number;
  totalPage: number;
};

export const initialChapterPageState = {
  currentPage: 1,
  totalPage: 1,
};

type Action =
  | { type: "next" }
  | { type: "prev" }
  | { type: "first" }
  | { type: "last" }
  | { type: "set"; payload: number };

export const chapterPageReducer = (
  state: ChapterPageState,
  action: Action
): ChapterPageState => {
  switch (action.type) {
    case "first":
      return { ...state, currentPage: 1 };
    case "last":
      return { ...state, currentPage: state.totalPage };
    case "next":
      return { ...state, currentPage: state.currentPage + 1 };
    case "prev":
      return { ...state, currentPage: state.currentPage - 1 };
    case "set":
      return { ...state, currentPage: action.payload };
    default:
      return state; // Best practice: return the current state for unknown actions
  }
};

type ChapterPageContext = {
  state: ChapterPageState;
  dispatch: Dispatch<Action>;
};

export const ChapterPageContext = createContext<ChapterPageContext>({
  state: initialChapterPageState,
  dispatch: () => {},
});

// ---- Provider ----
export const ChapterPageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    chapterPageReducer,
    initialChapterPageState
  );

  return (
    <ChapterPageContext.Provider value={{ state, dispatch }}>
      {children}
    </ChapterPageContext.Provider>
  );
};
