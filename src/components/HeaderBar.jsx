import React, { useState } from 'react';
import { FaBell, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';

const HeaderBar = ({ onLogout }) => {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setDark(root.classList.contains('dark'));
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-border flex items-center px-6 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold text-foreground">Construction Management System</h1>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded hover:bg-muted/20">
            <FaBell />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded">3</span>
          </button>

          <button className="p-2 rounded hover:bg-muted/20" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? <FaSun /> : <FaMoon />}
          </button>

          <div className="relative">
            <button onClick={() => setOpen(s => !s)} className="flex items-center gap-2 p-2 rounded hover:bg-muted/20">
              <FaUserCircle className="h-6 w-6" />
              <span className="hidden sm:inline">Robert</span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded shadow z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-muted/10" onClick={() => { setOpen(false); /* navigate to settings */ }}>
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-muted/10" onClick={() => { onLogout?.(); setOpen(false); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
