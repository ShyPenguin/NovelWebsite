import { getRouteApi, Link } from "@tanstack/react-router";
import type { RegisteredRouter, RouteIds } from "@tanstack/react-router";
import { Chevron, Ellipsis } from "../../../assets/icons/Index";

export type AppRouteIds = RouteIds<RegisteredRouter["routeTree"]>;

type PaginationProps = {
  currentPage: number;
  totalPage: number;
  route: AppRouteIds;
};

const PageNumber = ({
  number,
  dataCurrent,
  params,
}: Pick<PaginationProps, "route"> & {
  number: number;
  dataCurrent: boolean;
  params: any;
}) => {
  return (
    <li>
      <Link
        to={"."}
        search={(prev) => ({ ...prev, page: number })}
        params={params}
        className="pagination-buttons pagination-buttons-hover rounded-2xl"
        data-current={dataCurrent}
      >
        {number}
      </Link>
    </li>
  );
};

const Pagination = ({ currentPage, totalPage, route }: PaginationProps) => {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const routeApi = getRouteApi(route);
  const routeParams = routeApi.useParams();

  return (
    <ul className="w-full h-full flex justify-center items-center gap-1">
      {currentPage !== 1 && (
        <li>
          <Link
            className="pagination-buttons pagination-buttons-hover"
            to={"."}
            search={(prev) => ({ ...prev, page: prevPage })}
            params={routeParams}
          >
            <Chevron isOpen={false} initialRotation="rotate-90" />
            <p className="hidden sm:block">Previous</p>
          </Link>
        </li>
      )}

      {prevPage !== 1 && currentPage !== 1 && (
        <PageNumber
          route={route}
          number={1}
          params={routeParams}
          dataCurrent={false}
        />
      )}

      {currentPage > 2 && (
        <li>
          <Ellipsis className="h-4 w-6" />
        </li>
      )}

      {prevPage > 0 && (
        <PageNumber
          route={route}
          params={routeParams}
          number={prevPage}
          dataCurrent={false}
        />
      )}

      <PageNumber
        route={route}
        params={routeParams}
        number={currentPage}
        dataCurrent={true}
      />

      {nextPage <= totalPage && (
        <PageNumber
          route={route}
          params={routeParams}
          number={nextPage}
          dataCurrent={false}
        />
      )}

      {currentPage < totalPage - 1 && (
        <li>
          <Ellipsis className="h-4 w-6" />
        </li>
      )}

      {nextPage < totalPage && currentPage !== totalPage && (
        <PageNumber
          route={route}
          params={routeParams}
          number={totalPage}
          dataCurrent={false}
        />
      )}
      {currentPage !== totalPage && (
        <li>
          <Link
            className="pagination-buttons pagination-buttons-hover"
            to={"."}
            search={(prev) => ({ ...prev, page: nextPage })}
            params={routeParams}
          >
            <p className="hidden sm:block">Next</p>
            <Chevron isOpen={false} initialRotation="rotate-270" />
          </Link>
        </li>
      )}
    </ul>
  );
};

export default Pagination;
