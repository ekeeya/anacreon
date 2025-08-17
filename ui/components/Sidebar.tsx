"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { MdSearch, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { sidebarSections } from '@/config/sidebar';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  const base = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800";
  const inactive = "text-gray-900 dark:text-gray-50";
  const active = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold";
  return (
    <Link href={href} className={`${base} ${isActive ? active : inactive}`}>
      {icon}
      {children}
    </Link>
  );
};

interface CollapsibleSidebarLinkProps extends SidebarLinkProps {
  subLinks: { href: string; icon: React.ReactNode; label: string }[];
}

const CollapsibleSidebarLink: React.FC<CollapsibleSidebarLinkProps> = ({
  href,
  icon,
  children,
  subLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const pathname = usePathname();
  const hasActiveChild = subLinks.some((l) => pathname === l.href || pathname.startsWith(l.href));

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [subLinks, isOpen]);

  useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isOpen || hasActiveChild ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-50'
        }`}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          {icon}
          {children}
        </span>
        {isOpen ? (
          <MdKeyboardArrowUp className="h-5 w-5 transition-transform" />
        ) : (
          <MdKeyboardArrowDown className="h-5 w-5 transition-transform" />
        )}
      </button>
      <div
        ref={contentRef}
        className="ml-4 overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div className={`mt-2 space-y-1 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'} transition-all duration-300`}>
          {subLinks.map((link) => (
            <SidebarLink key={link.href} href={link.href} icon={link.icon}>
              {link.label}
            </SidebarLink>
          ))}
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col p-4 transition-all duration-300 rounded-tr-xl rounded-br-xl shadow-lg">
      {/* Top Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-400">
          <Logo className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Anacreon</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Emmanuel Lubowa Keeya</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 dark:focus:border-blue-400"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MdSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Navigation via config */}
      <nav className="flex flex-col gap-2 flex-grow">
        {sidebarSections.map((section, idx) => (
          <div key={idx} className={idx === 0 ? '' : 'mt-4'}>
            {section.heading && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">{section.heading}</h3>
            )}
            {section.items.map((item) =>
              item.type === 'link' ? (
                <SidebarLink key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </SidebarLink>
              ) : (
                <CollapsibleSidebarLink
                  key={item.label}
                  href={item.href || '#'}
                  icon={item.icon}
                  subLinks={item.children.map((c) => ({ href: c.href, icon: c.icon, label: c.label }))}
                >
                  {item.label}
                </CollapsibleSidebarLink>
              )
            )}
          </div>
        ))}
      </nav>

      {/* User Profile and Dark Mode Toggle */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-200 dark:border-neutral-800 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-300 flex items-center justify-center text-white text-md font-bold">E</div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">Emmanuel Lubowa</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
          </div>
        </div>
        <button
          onClick={() => {
            try {
              const { useTheme } = require("./ThemeProvider");
              const ctx = useTheme();
              ctx.toggleTheme();
            } catch {
              if (typeof window !== 'undefined') {
                const isDark = document.documentElement.classList.contains('dark');
                document.documentElement.classList.toggle('dark', !isDark);
                try { localStorage.setItem('theme', !isDark ? 'dark' : 'light'); } catch {}
              }
            }
          }}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition"
        >
          {typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.127 1.002C11.134 4.887 12 7.232 12 9.75c0 2.518-.866 4.864-2.345 7.03A.75.75 0 019.528 18.28a.75.75 0 00-.594.664A35.196 35.196 0 0012 21.75c.674 0 1.343-.027 2.003-.079a.75.75 0 00.664-.594 7.507 7.507 0 01-.127-1.002c-1.564-2.146-2.345-4.597-2.345-7.03s.781-4.884 2.345-7.03a.75.75 0 00-.664-.594A35.196 35.196 0 0012 2.25c-.674 0-1.343.027-2.003.079a.75.75 0 00-.664.594z" clipRule="evenodd" /></svg>
          ) : (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.498 3.75a.75.75 0 01-.379 1.455c-.754.26-1.464.59-2.126.985-.779.467-1.474 1.05-2.066 1.724a.75.75 0 11-1.04-1.084l.672-.647a6.002 6.002 0 012.358-1.594c.361-.176.74-.322 1.13-.432a.75.75 0 011.007.41zM2.25 9.75a.75.75 0 01.75-.75H5.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM4.243 14.743a.75.75 0 011.06-.02L6.37 13.56a.75.75 0 01.02-1.06.75.75 0 011.06-.02l.647.672a.75.75 0 01-.02 1.06c-.696.66-1.3.02-1.776-.757a.75.75 0 01.379 1.084zM9.75 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM17.25 9.75a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zM14.743 17.257a.75.75 0 01-.02-1.06l.672-.647a.75.75 0 011.06.02.75.75 0 01.02 1.06c-.696.66-1.3.02-1.776-.757a.75.75 0 01.379 1.084zM19.995 5.91a.75.75 0 01.379-1.455.75.75 0 011.04-.379l.672-.647a.75.75 0 01-.02-1.06c-.779-.467-1.474-1.05-2.066-1.724a.75.75 0 01-1.084.379l-.647.672a.75.75 0 01.41 1.007c.394.195.772.378 1.13.432zM12 18.75a.75.75 0 01-.75.75v2.25a.75.75 0 011.5 0v-2.25a.75.75 0 01-.75-.75z" /></svg>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
