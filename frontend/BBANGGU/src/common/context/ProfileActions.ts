import { Profile } from './ProfileContext';

export const updateProfile = (prevProfile: Profile, newProfile: Partial<Profile>): Profile => {
  return { ...prevProfile, ...newProfile };
}; 