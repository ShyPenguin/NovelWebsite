import NO_IMAGE from "../../assets/images/no_image.jpg";

export const DiscordLink = "https://discord.gg/dnuqX97E";

export const BackendApiLink = import.meta.env.VITE_BACKEND_API_URL;
export const CHAPTER_PAGE_SIZE = 30;

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 32;

export const MIN_LINE_SPACING = 1.2;
export const MAX_LINE_SPACING = 3.0;

export const TEXT_ALIGNMENT = {
  LEFT: 0 as 0,
  CENTER: 1 as 1,
  JUSTIFY: 2 as 2,
};

export const INTERVAL_24_HRS = 24 * 60 * 60 * 1000; // 24 hours
export const INTERVAL_12_HRS = 12 * 60 * 60 * 1000;
export const INTERVAL_6_HRS = 6 * 60 * 60 * 1000;
export const INTERVAL_1_HR = 1 * 60 * 60 * 1000;

export const LOGO_URL =
  "https://pberoczdewdtspygrofa.supabase.co/storage/v1/object/public/novelwebsite-images/logo/wetried_only.png";

export const NO_IMAGE_URL = NO_IMAGE;
export const THUMBNAILS = "thumbnails";
export const TRENDS = "trends";
export const ALL = "ALL";
export const CREATE = "create";
export const DELETE = "delete";
export const UPDATE = "update";
export const PREVIEW = "preview";
export const EDIT = "edit";
export const VIEW = "view";
export const NO_AUTHOR = "No Author";
export const ACTIONS = [DELETE, CREATE, UPDATE, PREVIEW, VIEW] as const;
