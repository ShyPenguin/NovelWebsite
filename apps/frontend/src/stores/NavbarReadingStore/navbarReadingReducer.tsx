export type NavbbarReadingStateType = {
  isReadingSettingOpen: boolean;
  isListChaptersOpen: boolean;
};

export type NavbarReadingAction =
  | { type: "openReadingSettingOpen" }
  | { type: "closeReadingSettingOpen" }
  | { type: "openListChaptersOpen" }
  | { type: "closeListChaptersOpen" }
  | { type: "setDefault" };

export const navbarReadingReducer = (
  state: NavbbarReadingStateType,
  action: NavbarReadingAction
) => {
  switch (action.type) {
    case "openReadingSettingOpen":
      return {
        ...state,
        isReadingSettingOpen: true,
      };
    case "closeReadingSettingOpen":
      return {
        ...state,
        isReadingSettingOpen: false,
      };
    case "openListChaptersOpen":
      return {
        ...state,
        isListChaptersOpen: true,
      };
    case "closeListChaptersOpen":
      return {
        ...state,
        isListChaptersOpen: false,
      };
    case "setDefault":
      return {
        isReadingSettingOpen: false,
        isListChaptersOpen: false,
      };
  }
};
