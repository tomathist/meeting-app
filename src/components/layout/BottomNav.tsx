import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Users, MessageCircle, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/discover', icon: Compass, label: '추천' },
  { path: '/rooms', icon: Users, label: '방' },
  { path: '/chat', icon: MessageCircle, label: '채팅' },
  { path: '/inbox', icon: Bell, label: '알림' },
  { path: '/profile', icon: User, label: '프로필' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-full gap-0.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full gradient-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
