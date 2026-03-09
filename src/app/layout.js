import "./globals.css";

export const metadata = {
  title: "AI Market Briefing",
  description: "AI 주식시장 일일 보고서",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-dark text-slate-100">{children}</body>
    </html>
  );
}
