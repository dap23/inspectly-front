import { Outlet } from 'react-router';
import { Navbar } from '../components/partials/Navbar.tsx';
import { Toaster } from 'react-hot-toast';

export default function DefaultLayout() {
  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Navbar/>
      <main className="p-10 space-y-8 w-full h-full min-h-[calc(100vh-130px)]">
        <Outlet/>
      </main>
      <footer className="p-3 text-center">
        <p className="text-xs text-gray-500">
          {new Date().getFullYear()} &copy; Muhammad Daffa. This application is built for the {' '}
          <strong>
            Blibli technical Test.
          </strong>
        </p>
      </footer>
    </div>
  );
}