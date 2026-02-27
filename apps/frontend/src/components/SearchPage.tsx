import type { ReactNode } from "react";

const SearchPage = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-150 h-full w-full p-5 flex flex-col">
      {children}
    </main>
  );
};

function SearchPageHeader({ title }: { title: string }) {
  return <h1 className="font-bold text-6xl text-foreground">{title}</h1>;
}
function SearchPageSearchbar({ children }: { children: ReactNode }) {
  return <div className="w-full h-10 my-2">{children}</div>;
}
function SearchPageBody({ children }: { children: ReactNode }) {
  return <div className="flex-1 flex flex-col gap-4">{children}</div>;
}
function SearchPageFooter({ children }: { children: ReactNode }) {
  return <div className="flex-center w-full h-10">{children}</div>;
}

SearchPage.Header = SearchPageHeader;
SearchPage.Body = SearchPageBody;
SearchPage.Searchbar = SearchPageSearchbar;
SearchPage.Footer = SearchPageFooter;

export default SearchPage;
