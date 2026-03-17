'use client';

import React, { useEffect } from 'react';
import { cn } from '@/libs/utils/utils';
import { useAuth } from '@/hooks/use-auth';
import { mockActivity } from '@/libs/utils/profileMock';

import { ProfileCard } from './left/ProfileCard';
import { StatsGrid } from './left/StatsGrid';
import { ConnectedAccounts } from './left/ConnectedAccounts';

import { AccountInfoCard } from './right/AccountInfoCard';
import { PersonalInfoCard } from './right/PersonalInfoCard';
import { RecentActivityCard } from './right/RecentActivityCard';
import { DangerZoneCard } from './right/DangerZoneCard';

interface ProfilePageProps {
  className?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ className }) => {
  const { user, fetchMe } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Admin';
      case 'MEMBER': return 'Member';
      default: return role || 'User';
    }
  };

  return (
    <main className={cn(
      'max-w-[880px] mx-auto px-5 py-8',
      'grid grid-cols-[252px_1fr] gap-5 items-start',
      'max-[680px]:grid-cols-1',
      className
    )}>
      <aside className="sticky top-0 flex flex-col gap-4 max-[680px]:static">
        <ProfileCard
          username={user?.username || '-'}
          email={user?.email || '-'}
          role={getRoleDisplay(user?.role)}
          profileImgUri={user?.profile_img_uri || undefined}
        />
        
        <StatsGrid stats={{ total: 0, dangers: 0, accuracy: 0, days: 0 }} />
        
        <ConnectedAccounts 
          googleConnected={!!user?.gg_id}
          githubConnected={!!user?.gh_id}
        />
      </aside>
      
      <section className="flex flex-col gap-[18px]">
        <AccountInfoCard
          username={user?.username || '-'}
          email={user?.email || '-'}
        />
        
        <PersonalInfoCard 
          fullName={user?.full_name || ''}
          birthday={user?.birthday || undefined}
        />
        
        <RecentActivityCard activities={mockActivity} />
        
        <DangerZoneCard />
      </section>
    </main>
  );
};

export default ProfilePage;
