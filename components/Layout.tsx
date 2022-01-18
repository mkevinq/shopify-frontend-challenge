import Link from "next/link";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import Calendar from "../public/calendar.svg";
import GitHub from "../public/github.svg";
import Heart from "../public/heart.svg";
import Home from "../public/home.svg";
import Moon from "../public/moon.svg";
import Sun from "../public/sun.svg";

import Toggle from "./Toggle";

type LayoutProps = {
  title: string;
};

/**
 * Generic layout for all app pages.
 * 
 * @returns {ReactElement} - Markup for the page layout.
 */
const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const [dark, setDarkMode] = useState(false);
  const githubLink = useRef<HTMLAnchorElement>(null);
  const homeLink = useRef<HTMLAnchorElement>(null);
  const likedLink = useRef<HTMLAnchorElement>(null);
  const dateLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const dark = localStorage.getItem("dark") ?? "false";
    setDarkMode(JSON.parse(dark));
  }, []);

  return (
    <div className={dark ? "dark h-full w-full" : "h-full w-full"}>
      <title>{title}</title>

      <div
        id="header"
        className="sticky top-0 w-full h-12 p-4 flex place-items-center justify-between z-10 bg-white dark:bg-neutral-700 dark:text-white drop-shadow-md"
      >
        <Link
          passHref={true}
          href="https://github.com/mkevinq/shopify-frontend-challenge"
        >
          <a
            id="github-link"
            tabIndex={0}
            ref={githubLink}
            onKeyDown={() => githubLink.current?.click()}
            className="flex flex-col place-items-center text-xs"
          >
            <GitHub
              role="img"
              title="GitHub"
              alt="GitHub logo"
              className="h-6 w-6"
            />
          </a>
        </Link>
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
          Spacetagram
        </h1>
        <div id="dark-mode-toggle" className="flex gap-2 place-items-center">
          <Sun role="img" title="Light mode" alt="Sun" className="h-4 w-4" />
          <Toggle
            value={dark}
            title="Dark and light mode toggle"
            onToggle={(event, value: boolean) => {
              setDarkMode(value);
              localStorage.setItem("dark", JSON.stringify(value));
            }}
          />
          <Moon role="img" title="Dark mode" alt="Moon" className="h-4 w-4" />
        </div>
      </div>

      <div
        id="layout-container"
        className="w-full min-h-screen py-4 mb-12 bg-gray-100 dark:bg-neutral-800 dark:text-white"
      >
        {children}
      </div>

      <nav
        id="nav-bar"
        className="fixed bottom-0 w-full h-12 p-4 flex place-items-center justify-around z-10 bg-white dark:bg-neutral-700 dark:text-white drop-shadow-md"
      >
        <Link passHref={true} href="/">
          <a
            id="home-link"
            tabIndex={0}
            ref={homeLink}
            onKeyDown={() => homeLink.current?.click()}
            className="flex flex-col place-items-center text-xs"
          >
            <Home role="img" className="h-6 w-6 cursor-pointer" />
            Home
          </a>
        </Link>
        <Link passHref={true} href="/liked">
          <a
            id="liked-link"
            ref={likedLink}
            onKeyDown={() => likedLink.current?.click()}
            className="flex flex-col w-12 place-items-center text-xs"
          >
            <Heart
              role="img"
              title="Liked Posts"
              value="test"
              className="h-6 w-6 cursor-pointer"
            />
            Liked
          </a>
        </Link>
        <Link passHref={true} href="/date">
          <a
            id="dates-link"
            ref={dateLink}
            onKeyDown={() => dateLink.current?.click()}
            className="flex flex-col w-12 place-items-center text-xs"
          >
            <Calendar
              role="img"
              title="Custom Date Range"
              className="h-6 w-6 cursor-pointer"
            ></Calendar>
            By Date
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
