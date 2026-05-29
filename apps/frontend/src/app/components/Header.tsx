export const Header = () => {
  return (
    <div className="relative flex size-full z-3">
      <div className="flex-center size-full z-2">
        <img
          src="https://media.reaperscans.net/file/7BSHk1m/y0rsqzin4kecjtqwdk31bmwb.webp"
          className="h-62.5"
        />
      </div>
      <div className="absolute top-3.75 left-0 right-0 bottom-0 rounded-2xl z-1">
        <div className="flex h-full w-full">
          <img
            src="https://media.reaperscans.net/file/7BSHk1m/ylaxfpkdlzcrbrkjrjcpx32u.webp"
            className="h-full w-full rounded-2xl object-cover opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
