import { Link } from "@tanstack/react-router";

type TrendingNumberOneProps = {
  id: string;
  imgURL: string;
  title: string;
};

export const TrendingNumberOne = ({
  id,
  imgURL,
  title,
}: TrendingNumberOneProps) => {
  return (
    <Link
      to="/novels/$novelId/chapters"
      params={{ novelId: id }}
      search={{ page: 1, sort: "desc", search: "" }}
    >
      <div className="flex flex-col w-full card">
        <img src={imgURL} className="object-cover object-center h-60" />
        <div className="flex py-2 px-4 gap-8">
          <h1 className="font-bold">#1</h1>
          <h5 className="flex-1 min-w-0 text-inherit dark:text-inherit text-left text-lg font-bold line-clamp-1">
            {title}
          </h5>
        </div>
      </div>
    </Link>
  );
};
