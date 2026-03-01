import CenterAllign from "@/assets/icons/CenterAllign";
import FontSizeIcon from "@/assets/icons/FontSizeIcon";
import JustifyAllign from "@/assets/icons/JustfiyAlign";
import LeftAllign from "@/assets/icons/LeftAllign";
import LineHeightIcon from "@/assets/icons/LineHeightIcon";
import Minus from "@/assets/icons/Minus";
import Plus from "@/assets/icons/Plus";
import ResetIcon from "@/assets/icons/ResetIcon";
import HorizontalLine from "@/shared/components/HorizontalLine";
import { SidebarAnimated } from "@/shared/components/SidebarAnimated";
import {
  TEXT_ALIGNMENT,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MIN_LINE_SPACING,
  MAX_LINE_SPACING,
} from "@/shared/constants";
import { useNavbarReadingContext } from "../../stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";
import { useChapterReadingContext } from "../../stores/ChapterReadingSettingContext";

const ReadingSetting = () => {
  const { state, dispatch } = useChapterReadingContext();
  const { dispatch: navbarReadingDispatch } = useNavbarReadingContext();

  return (
    <SidebarAnimated
      onClose={() => navbarReadingDispatch({ type: "closeReadingSettingOpen" })}
    >
      <div className="flex flex-col size-full p-6 gap-4">
        <div>
          {/* READER SETTINGS WITH RESET BUTTON */}
          <div className="flex justify-between items-center pb-2">
            <h3 className="font-bold">Reader Settings</h3>
            <button
              className="reading-setting-card reading-setting-card-hover h-8"
              onClick={() => dispatch({ type: "setDefault" })}
            >
              <ResetIcon />
            </button>
          </div>
          <HorizontalLine />
        </div>
        <div className="flex flex-col gap-4">
          {/* READING SETTING LABEL */}
          <div className="space-y-2">
            <h4 className="reading-setting-label leading-none">
              Reader settings
            </h4>
            <p className="text-xs text-muted-foreground">
              Style the text the way you want.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* TEXT ALIGNMENT */}
            <div className="flex flex-col gap-2">
              <h4 className="reading-setting-label">Text Alignment</h4>
              <div className="flex gap-2">
                <button
                  data-state={
                    state.textAlignment == TEXT_ALIGNMENT.LEFT ? "on" : "off"
                  }
                  className="reading-setting-card reading-setting-card-hover"
                  onClick={() => dispatch({ type: "setTextAlignmentLeft" })}
                >
                  <LeftAllign className="w-4 h-4" />
                </button>
                <button
                  data-state={
                    state.textAlignment == TEXT_ALIGNMENT.CENTER ? "on" : "off"
                  }
                  className="reading-setting-card reading-setting-card-hover"
                  onClick={() => dispatch({ type: "setTextAlignmentCenter" })}
                >
                  <CenterAllign className="w-4 h-4" />
                </button>
                <button
                  data-state={
                    state.textAlignment == TEXT_ALIGNMENT.JUSTIFY ? "on" : "off"
                  }
                  className="reading-setting-card reading-setting-card-hover"
                  onClick={() => dispatch({ type: "setTextAlignmentJustify" })}
                >
                  <JustifyAllign className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FONT SIZE */}

            <div className="flex flex-col gap-1">
              <h4 className="reading-setting-label">Font Size</h4>
              <div className="flex items-center gap-4">
                <div>
                  <FontSizeIcon />
                </div>
                <button
                  className="reading-setting-card reading-setting-card-hover px-4 py-2"
                  onClick={() => dispatch({ type: "incrementFontSize" })}
                  disabled={state.fontSize >= MAX_FONT_SIZE}
                >
                  <Plus />
                </button>
                <p>{`${state.fontSize}`}</p>
                <button
                  className="reading-setting-card reading-setting-card-hover px-4 py-2"
                  onClick={() => dispatch({ type: "decrementFontSize" })}
                  disabled={state.fontSize <= MIN_FONT_SIZE}
                >
                  <Minus />
                </button>
              </div>
            </div>

            {/* LINE HEIGHT */}
            <div className="flex flex-col gap-1">
              <h4 className="reading-setting-label">Line Height</h4>
              <div className="flex items-center gap-4">
                <div>
                  <LineHeightIcon />
                </div>
                <button
                  className="reading-setting-card reading-setting-card-hover px-4 py-2"
                  onClick={() => dispatch({ type: "incrementLineSpacing" })}
                  disabled={state.lineSpacing <= MIN_LINE_SPACING}
                >
                  <Plus />
                </button>
                <p>{`${state.lineSpacing}`}</p>
                <button
                  className="reading-setting-card reading-setting-card-hover px-4 py-2"
                  onClick={() => dispatch({ type: "decrementLineSpacing" })}
                  disabled={state.lineSpacing >= MAX_LINE_SPACING}
                >
                  <Minus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarAnimated>
  );
};

export default ReadingSetting;
