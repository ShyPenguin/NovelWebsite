import {
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MIN_LINE_SPACING,
  MAX_LINE_SPACING,
  TEXT_ALIGNMENT,
} from "@/shared/constants";
import { usePersistedReducer } from "@/shared/hooks/usePersistedReducer";
import { roundToTenth } from "@/shared/utils";
import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
} from "react";

// 0 = Start-left | 1 = Center | 2 = Justify
type ChapterReadingSettingType = {
  fontSize: number;
  lineSpacing: number;
  textAlignment: 0 | 1 | 2;
};

type Action =
  | { type: "setFontSize"; payload: number }
  | { type: "decrementFontSize" }
  | { type: "incrementFontSize" }
  | { type: "setLineSpacing"; payload: number }
  | { type: "decrementLineSpacing" }
  | { type: "incrementLineSpacing" }
  | { type: "setTextAlignmentLeft" }
  | { type: "setTextAlignmentCenter" }
  | { type: "setTextAlignmentJustify" }
  | { type: "setDefault" };

const initialChapterReadingSetting: ChapterReadingSettingType = {
  fontSize: 18,
  lineSpacing: 1.8,
  textAlignment: 0,
};

export const chapterReadingSettingReducer = (
  state: ChapterReadingSettingType,
  action: Action,
) => {
  switch (action.type) {
    // Font Size
    case "setFontSize":
      return {
        ...state,
        fontSize: Math.min(
          MAX_FONT_SIZE,
          Math.max(MIN_FONT_SIZE, action.payload),
        ),
      };
    case "decrementFontSize":
      return {
        ...state,
        fontSize: Math.max(MIN_FONT_SIZE, state.fontSize - 1),
      };
    case "incrementFontSize":
      return {
        ...state,
        fontSize: Math.min(MAX_FONT_SIZE, state.fontSize + 1),
      };
    // Line Spacing
    case "setLineSpacing":
      return { ...state, lineSpacing: action.payload };
    case "decrementLineSpacing":
      return {
        ...state,
        lineSpacing: Math.max(
          MIN_LINE_SPACING,
          roundToTenth(state.lineSpacing - 0.1),
        ),
      };
    case "incrementLineSpacing":
      return {
        ...state,
        lineSpacing: Math.min(
          MAX_LINE_SPACING,
          roundToTenth(state.lineSpacing + 0.1),
        ),
      };
    // Alignment
    case "setTextAlignmentLeft":
      return {
        ...state,
        textAlignment: TEXT_ALIGNMENT.LEFT,
      };
    case "setTextAlignmentCenter":
      return {
        ...state,
        textAlignment: TEXT_ALIGNMENT.CENTER,
      };
    case "setTextAlignmentJustify":
      return {
        ...state,
        textAlignment: TEXT_ALIGNMENT.JUSTIFY,
      };
    case "setDefault":
      return { ...initialChapterReadingSetting, isNavbarOpen: true };
    default:
      return state;
  }
};

type ChapterReadingSettingContextType = {
  state: ChapterReadingSettingType;
  dispatch: Dispatch<Action>;
};

export const ChapterReadingSettingContext =
  createContext<ChapterReadingSettingContextType>({
    state: initialChapterReadingSetting,
    dispatch: () => {},
  });

export const ChapterReadingSettingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = usePersistedReducer(
    chapterReadingSettingReducer,
    initialChapterReadingSetting,
    "chapter-reading-settings", // storage key
  );

  return (
    <ChapterReadingSettingContext.Provider value={{ state, dispatch }}>
      {children}
    </ChapterReadingSettingContext.Provider>
  );
};

export const useChapterReadingContext = () => {
  return useContext(ChapterReadingSettingContext);
};
