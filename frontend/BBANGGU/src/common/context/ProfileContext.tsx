/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { updateProfile } from './ProfileActions';

export interface Profile {
  name: string;
  description: string;
  profileImage: string | null;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const DEFAULT_PROFILE = {
  name: '서유민',
  description: '오늘도 빵과 함께 할기찬 하루 보내세요~',
  profileImage: null
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleUpdateProfile = (newProfile: Partial<Profile>) => {
    setProfile(prev => updateProfile(prev, newProfile));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile: handleUpdateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}