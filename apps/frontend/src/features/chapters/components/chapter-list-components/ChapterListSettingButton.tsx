import ListIcon from "../../../../assets/icons/ListIcon";
import { useNavbarReadingContext } from "../../stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";

const ChapterListSettingButton = () => {
  const { dispatch } = useNavbarReadingContext();

  return (
    <button
      className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
      onClick={() => dispatch({ type: "openListChaptersOpen" })}
    >
      <ListIcon className="w-4.25" />
    </button>
  );
};

export default ChapterListSettingButton;
