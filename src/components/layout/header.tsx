'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Github, Key, LogOut, Blocks } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ExtensionModal } from '@/components/ui';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const router = useRouter();
  const { user, logout, fetchMe } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <header className="h-16 bg-light border-b border-gray-primary-1 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-primary-0 hover:text-dark"
            >
              <Menu size={24} />
            </button>
          )}
          {title && <h2 className="text-xl font-bold text-dark">{title}</h2>}
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/TheeraphatStudent"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-primary-0 hover:text-dark hover:bg-gray-primary-2 rounded-lg transition-all"
            title="GitHub Contributor"
          >
            <Github size={20} />
          </a>

          <button
            onClick={() => setShowExtensionModal(true)}
            className="p-2 text-gray-primary-0 hover:text-dark hover:bg-gray-primary-2 rounded-lg transition-all"
            title="Extension Access Token"
          >
            <Blocks size={20} />
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative p-2 text-gray-primary-0 hover:text-dark hover:bg-gray-primary-2 rounded-lg transition-all flex items-center gap-2"
            >
              {user?.profile_img_uri ? (
                <img 
                  src={user.profile_img_uri} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-dark">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-primary-1 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-primary-1">
                    <p className="text-sm font-semibold text-dark">{user?.username || '-'}</p>
                    <p className="text-xs text-gray-primary-0 truncate">{user?.email || '-'}</p>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowExtensionModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-dark hover:bg-gray-primary-2 rounded-lg transition-colors"
                    >
                      <Key size={16} />
                      Extension Token
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-accent-light-red rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      ออกจากระบบ
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <ExtensionModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        chromeStatus="available"
        firefoxStatus="available"
      />
    </>
  );
};
