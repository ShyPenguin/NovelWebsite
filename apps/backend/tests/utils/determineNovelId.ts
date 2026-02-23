//This is based on db.json which is also another mockdata
export const determineNovelFactory =
  ({
    novel,
    novel2,
    novel3,
    novel4,
    novel5,
    novel6,
    novel7,
  }: {
    novel: string;
    novel2: string;
    novel3: string;
    novel4: string;
    novel5: string;
    novel6: string;
    novel7: string;
  }) =>
  ({ novelId }: { novelId: string }): string => {
    switch (novelId) {
      case "A Regressor's Tale of Cultivation":
        return novel;
      case "A Knight who Eternally Regresses":
        return novel2;
      case "I'm an Infinite Regressor, But I've Got Stories to Tell":
        return novel3;
      case "Omniscient Reader's Viewpoint":
        return novel4;
      case "Regression is Too Much":
        return novel5;
      case "SSS-Class Hunter who dies to live":
        return novel6;
      case "The Reincarnated Assassin is a Genius Swordsman":
        return novel7;
      default:
        return novel5;
    }
  };
