import { ImageField } from "./imageField";

export interface Profile {
  image?: ImageField | null;
  displayName?: string | null;
}

export function setProfileDefaults(p: Partial<Profile>) {
  const defaultedProfile: Profile = {
    image: p.image || null,
    displayName: p.displayName || null,
  };

  return defaultedProfile;
}