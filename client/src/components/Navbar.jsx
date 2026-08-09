import React from 'react';
import { 
  Factory, LayoutDashboard, Calculator, Sliders, Sparkles, 
  Bot, TrendingUp, Truck, Layers, LogIn, LogOut, ShieldCheck, Home
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'whatif', label: 'What-If Simulator', icon: Sliders },
    { id: 'optimizer', label: 'Optimizer', icon: Sparkles },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Bot },
    { id: 'forecasting', label: 'Cost Forecast', icon: TrendingUp },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'batches', label: 'Batch Manager', icon: Layers },
  ];

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <Factory className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                  FOOD<span className="text-emerald-400">COST</span>
                </span>
                <span className="badge badge-emerald text-[10px]">OPTIMIZER v1.0</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Food Processing Economics Platform</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'landing' 
                  ? 'bg-emerald-500 text-black shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-500 text-black shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 text-xs max-w-[240px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 self-center" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-white block leading-tight truncate">{user.name}</span>
                    <span className="text-[10px] text-gray-400 block leading-tight truncate">{user.companyName || 'Operations Manager'}</span>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="btn btn-secondary text-xs p-2 sm:px-3 sm:py-1.5"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn btn-primary text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Horizontal Sub-Navbar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 border-t border-gray-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'landing' ? 'bg-emerald-500 text-black' : 'text-gray-400 bg-gray-800'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold shrink-0 ${
                isActive ? 'bg-emerald-500 text-black' : 'text-gray-400 bg-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
