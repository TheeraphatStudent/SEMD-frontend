'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { mockUser, mockActivity } from '@/lib/profileMock';

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
  return (
    <main className={cn(
      'max-w-[880px] mx-auto px-5 py-8',
      'grid grid-cols-[252px_1fr] gap-5 items-start',
      'max-[680px]:grid-cols-1',
      className
    )}>
      <aside className="sticky top-0 flex flex-col gap-4 max-[680px]:static">
        <ProfileCard
          username={mockUser.username}
          email={mockUser.email}
          role={mockUser.role}
        />
        
        <StatsGrid stats={mockUser.stats} />
        
        <ConnectedAccounts initialConnections={mockUser.connections} />
      </aside>
      
      <section className="flex flex-col gap-[18px]">
        <AccountInfoCard
          username={mockUser.username}
          email={mockUser.email}
        />
        
        <PersonalInfoCard />
        
        <RecentActivityCard activities={mockActivity} />
        
        <DangerZoneCard />
      </section>
    </main>
  );
};

export default ProfilePage;
