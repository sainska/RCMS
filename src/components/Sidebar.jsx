import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ title = 'RCMS', subtitle = '', mainModules = [], analytics = [], onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isActive = (route) => route && location.pathname === route;

  return (
    <aside className={`flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-sidebar-background border-r border-sidebar-border min-h-screen`}>
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-construction p-2 rounded-lg">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 9v6l10 5 10-5V9l-10 0z"/></svg>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">{title}</h2>
              <p className="text-xs text-sidebar-foreground/60">{subtitle}</p>
            </div>
          )}
        </div>
        <button
          aria-label="Toggle sidebar"
          className="p-2 rounded hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sidebar-border"
          onClick={() => setCollapsed(s => !s)}
        >
          <FaBars />
        </button>
      </div>

      <nav className="flex-1 overflow-auto px-2 py-4 custom-scrollbar">
        <div className="mb-4">
          {!collapsed && <p className="text-xs font-semibold text-sidebar-foreground/80 uppercase tracking-wider mb-2">Main Modules</p>}
          <div className="flex flex-col gap-2">
            {mainModules.map((m) => {
              const active = isActive(m.route) || m.active;
              return (
                <button
                  key={m.name}
                  onClick={() => onNavigate?.(m.route)}
                  title={m.name}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all outline-none ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
                >
                  <span className="w-5 h-5 flex-shrink-0">{m.icon}</span>
                  {!collapsed && <span>{m.name}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!collapsed && <p className="text-xs font-semibold text-sidebar-foreground/80 uppercase tracking-wider mb-2">Analytics</p>}
          <div className="flex flex-col gap-2">
            {analytics.map((m) => {
              const active = isActive(m.route);
              return (
                <button
                  key={m.name}
                  onClick={() => onNavigate?.(m.route)}
                  title={m.name}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all outline-none ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
                >
                  <span className="w-5 h-5 flex-shrink-0">{m.icon}</span>
                  {!collapsed && <span>{m.name}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-avatar flex items-center justify-center text-white">{title?.charAt(0) || 'R'}</div>
          {!collapsed && <div className="text-xs text-sidebar-foreground/80">Signed in</div>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
