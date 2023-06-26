import { getProfile } from "../api/profile";
import { Profile } from "../types/profile";
import { useSWR } from "../utils/cache.react";

export function getProfileCacheKey(userId: string) {
  return `${userId}/profile`;
}

export function useProfile(userId: string) {
  const { loading: profileLoading, value: profile } = useSWR<Profile>(
    getProfileCacheKey(userId),
    () => getProfile(userId)
  );

  return { profileLoading, profile };
}

export interface ProfileWithUserId {
  userId: string;
  profile: Profile;
}

export function useProfiles(userIds: string[]) {
  const { loading: profilesLoading, value: profiles } = useSWR<
    ProfileWithUserId[]
  >(`/profiles?userIds=${userIds.join(",")}`, async () => {
    const profiles = await Promise.all(
      userIds.map(async (userId) => ({
        userId,
        profile: await getProfile(userId),
      }))
    );
    return profiles.filter((p): p is ProfileWithUserId => !!p.profile);
  });

  return { profilesLoading, profiles };
}
