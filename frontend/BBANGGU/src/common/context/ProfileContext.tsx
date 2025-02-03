import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Profile {
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
  // localStorage에서 저장된 프로필을 가져오거나, 없으면 기본값 사용
  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
  });

  // profile이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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