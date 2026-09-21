import {
  useState,
  useEffect,
} from "react";

import {
  Outlet,
} from "react-router";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

function AppLayout() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  function openMobileSidebar() {
    setMobileSidebarOpen(true);
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-app">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        <AppSidebar />
      </div>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={
            closeMobileSidebar
          }
          className="
            fixed inset-0
            z-40
            bg-slate-950/30
            md:hidden
          "
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          transform
          transition-transform
          duration-200
          ease-out
          md:hidden

          ${mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        <AppSidebar
          mobile
          onNavigate={
            closeMobileSidebar
          }
          onClose={
            closeMobileSidebar
          }
        />
      </div>

      {/* Main application */}
      <div className="min-h-screen md:pl-64">
        <AppHeader
          onOpenMenu={
            openMobileSidebar
          }
        />

        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;