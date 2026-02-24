// app/layout.js
export const metadata = {
  title: 'ManadaBook',
  description: 'Red social para mascotas de Raízel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
