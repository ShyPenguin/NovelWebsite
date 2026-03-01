import { useContext } from "react";
import { AppContext } from "../stores/AppContext";
import { Moon, Sun } from "../../assets/icons/Index";

type ThemeButtonProp = {
  className: string;
  iconClass?: string;
  text?: boolean;
};
export const ThemeButton = ({
  className,
  iconClass = "w-6 h-6",
  text = false,
}: ThemeButtonProp) => {
  const { setTheme, theme } = useContext(AppContext);

  return (
    <button className={className} onClick={() => setTheme((prev) => !prev)}>
      {theme ? <Moon className={iconClass} /> : <Sun className={iconClass} />}
      {text && (theme ? "Light" : "Dark")}
    </button>
  );
};
