import { Gear } from "../../../assets/icons/Index";
import { useNavbarReadingContext } from "../../../stores/NavbarReadingStore/NavbarReadingContext";

const ReadingSettingButton = () => {
  const { dispatch } = useNavbarReadingContext();

  return (
    <button
      className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
      onClick={() => dispatch({ type: "openReadingSettingOpen" })}
    >
      <Gear className="w-[17px]" />
    </button>
  );
};

export default ReadingSettingButton;
