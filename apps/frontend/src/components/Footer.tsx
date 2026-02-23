import { LOGO_URL } from "../constants";

export const Footer = () => {
  return (
    <div className="flex-center flex-col px-5 py-4 gap-4">
      <img src={LOGO_URL} className="h-8 mr-3" alt="We Tried TLS Logo" />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm text-center">
          We Tried Clone. Website coded by Jawad.
        </span>
      </div>
    </div>
  );
};
