import "./globals.css";

export const metadata = {
  title: "Todos App",
  description: "A simple Todos App with view toggle functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-xl font-bold">Todos App</h1>
          </header>
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
