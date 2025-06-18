import { ReactNode } from 'react';
import Header from '@/components/Header';//Encabezado de la app
import Footer from '@/components/Footer';//Footer de la app

interface LayoutProps {
  children: ReactNode;
}
//Aqui se renderiza todo en children
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}