import {
  Menu,
} from "lucide-react";

import GlobalSearch from "./GlobalSearch";

import NotificationBell from "../notifications/NotificationBell";

function AppHeader({
  onOpenMenu,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-border
        bg-surface/95
        backdrop-blur
      "
    >
      {/* Main header row */}
      <div
        className="
          flex h-14
          items-center
          gap-3
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <button
          type="button"
          onClick={
            onOpenMenu
          }
          aria-label="Open navigation"
          className="
            inline-flex
            h-9 w-9
            shrink-0
            items-center
            justify-center
            rounded-control
            text-muted
            hover:bg-surface-muted
            hover:text-heading
            md:hidden
          "
        >
          <Menu size={19} />
        </button>

        {/* Desktop global search */}
        <div className="hidden min-w-0 flex-1 md:block">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <NotificationBell />
        </div>
      </div>

      {/* Mobile global search */}
      <div className="border-t border-border px-4 py-3 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}

export default AppHeader;