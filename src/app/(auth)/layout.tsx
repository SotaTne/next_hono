export default function AuthHome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>(Auth)Page</h1>
      {children}
    </div>
  );
}
