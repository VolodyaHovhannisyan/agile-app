import './global.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Dashboard',
  description: 'Real-time dashboard powered by Redux and socket.io',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
