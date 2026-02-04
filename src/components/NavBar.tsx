import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, Link } from "react-router";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const location = useLocation();

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b backdrop-blur-md py-12"
      style={{
        height: "var(--navbar-height)",
        backgroundColor: "rgba(10, 10, 10, 0.7)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="relative flex h-full items-center justify-between">
          <div className="flex items-center sm:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white transition">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-2 bg-indigo-500 rounded-xl group-hover:bg-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                <img
                  src="logo.png"
                  alt="logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-white text-xl sm:text-2xl font-black tracking-tighter leading-none hidden sm:block">
                  LINUX<span className="text-indigo-400">READY</span>
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase hidden sm:block">
                  Steam Compatibility
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={classNames(
                    isActive
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <DisclosurePanel
        className="sm:hidden border-b border-(--border-color) backdrop-blur-md"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.7)" }}
      >
        <div className="space-y-1 px-4 pt-2 pb-6 shadow-2xl">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  isActive
                    ? "text-white bg-indigo-500/20 border-l-2 border-indigo-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                  "block px-3 py-3 text-base font-medium transition-all",
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default NavBar;
