import type { ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-150 h-full w-full p-5 flex flex-col">
      {children}
    </main>
  );
};

function PageHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={`font-bold text-2xl text-foreground ${className}`}>
      {title}
    </h1>
  );
}
function PageSearchbar({ children }: { children: ReactNode }) {
  return <div className="w-full h-10 my-2">{children}</div>;
}
function PageBody({
  children,
  type = "full",
}: {
  children: ReactNode;
  type?: "full" | "center";
}) {
  return type == "full" ? (
    <section className="flex-1 flex flex-col gap-4">{children}</section>
  ) : (
    <section className="flex items-start justify-center size-full py-4 px-2 bg-inherit dark:bg-inherit">
      <div className="flex items-center md:items-start flex-col size-full max-w-4xl justify-center md:flex-row gap-2">
        {children}
      </div>
    </section>
  );
}

function PageFooter({ children }: { children: ReactNode }) {
  return <div className="flex-center w-full h-10">{children}</div>;
}

Page.Header = PageHeader;
Page.Body = PageBody;
Page.Searchbar = PageSearchbar;
Page.Footer = PageFooter;

export default Page;
