import { Paper } from "../assets/icons/Index";
import { LOGO_URL } from "../constants";

const AnnouncementCard = ({ title, date }: { title: string; date: string }) => {
  return (
    <div className="card dark:bg-primary-gray/5 flex w-full h-full py-2 px-2">
      <div className="flex-center">
        <img src={LOGO_URL} className="logo-img mr-5" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">{title}</p>
        <p className="line-clamp-2 text-xxs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
};
export const Announcements = () => {
  return (
    <div className="flex flex-col gap-2 size-full">
      <div className="flex items-center">
        <div className="flex-center">
          <Paper className="w-7 h-7" />
        </div>
        <h1>Announcement</h1>
      </div>
      <h5>The latest news on our website.</h5>
      <AnnouncementCard title={"happy"} date={"04/03/2024"} />
      <AnnouncementCard title={"happy"} date={"04/03/2024"} />
      <AnnouncementCard title={"happy"} date={"04/03/2024"} />
    </div>
  );
};
