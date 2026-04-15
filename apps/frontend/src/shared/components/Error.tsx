export const Error = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  );
};
