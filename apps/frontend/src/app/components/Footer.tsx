import { LOGO_URL } from "@/shared/constants";

export const Footer = () => {
  return (
    <div className="flex-center flex-col px-5 py-4 gap-4">
      <img src={LOGO_URL} className="h-8 mr-3" alt="We Tried TLS Logo" />
      <div className="flex flex-col text-muted-foreground text-sm text-center wrap-anywhere">
        <span>We Tried Clone. Coded by Jawad Domato.</span>
        <span>Not made for commercial purposes</span>
      </div>
    </div>
  );
};
