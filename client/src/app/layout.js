import "./globals.css";

export const metadata = {
  title: "Tic tac toe",
  description: "Play online and with friends with tic tac toe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className="select-none dark:bg-yellow-400">{children}</body>
    </html>
  );
}
