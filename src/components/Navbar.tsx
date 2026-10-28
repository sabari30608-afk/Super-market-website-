import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  FolderGit2,
  ChevronDown,
  X,
  PackagePlus,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { USER_PROFILES } from '../data/users';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenProjectHub: () => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onOpenStoreManager?: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenProjectHub,
  currentUser,
  onSwitchUser,
  onOpenStoreManager,
  onScrollToSection,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-2 sm:gap-4 md:gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              onClick={() => onScrollToSection('hero')}
              className="text-left focus:outline-none"
              aria-label="kaadugal Home"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => onScrollToSection('hero')}
                className="hover:text-[#ff9900] transition"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('categories')}
                className="hover:text-[#ff9900] transition"
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('products')}
                className="hover:text-[#ff9900] transition"
              >
                Products
              </button>
            </nav>
          </div>

          {/* Search Bar - Live instant search */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-2">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search fruits, vegetables, groceries, snacks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl placeholder:text-slate-400 focus:bg-white focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 transition-all outline-none"
              />
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Discrete "Project Files" Academic Button */}
            <button
              type="button"
              onClick={onOpenProjectHub}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition group shadow-2xs"
              title="Inspect College Project Architecture (Java OOP & MySQL)"
            >
              <FolderGit2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Project Files</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-100 text-amber-800 rounded font-bold">
                Java
              </span>
            </button>

            {/* If Manager, Restock Button */}
            {currentUser.role === 'manager' && onOpenStoreManager && (
              <button
                type="button"
                onClick={onOpenStoreManager}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                title="Manage and restock inventory"
              >
                <PackagePlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Restock</span>
              </button>
            )}

            {/* Profile Button */}
            <div className="relative">
              <button
                type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition text-left"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ff9900] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center ring-2 ring-amber-400/50 shadow-2xs select-none shrink-0">
                    R
                  </div>
                  <div className="hidden md:block leading-tight">
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500">{currentUser.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 p-2 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-3">
                      <div className="w-11 h-11 rounded-full bg-linear-to-tr from-[#ff9900] to-amber-400 text-slate-950 font-black text-lg flex items-center justify-center ring-2 ring-amber-400 shadow-xs select-none shrink-0">
                        R
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-xs font-semibold text-amber-700">
                          Role: {currentUser.role}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          sabari30608@gmail.com
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {onOpenStoreManager && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenStoreManager();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                        >
                          <PackagePlus className="w-4 h-4 text-amber-600" />
                          <span>Manage Store Inventory</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onOpenProjectHub();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                      >
                        <FolderGit2 className="w-4 h-4 text-slate-600" />
                        <span>View Project Source Files</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            {/* Cart Button with real-time badge count and total amount */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0f1111] hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm active:scale-[0.98]"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#ff9900]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#ff9900] text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0f1111]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
