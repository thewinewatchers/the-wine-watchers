import "./globals.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Menu />
        {children}
        <Footer />
      </body>
    </html>
  );
}