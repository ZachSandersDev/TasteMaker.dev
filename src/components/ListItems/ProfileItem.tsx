import Button from "../../@design/components/Button/Button";
import { Profile } from "../../@modules/types/profile";

import { ProfileImage } from "../ProfileImage";

export type ProfileItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  userId?: string;
  profile?: Profile;
  disabled?: boolean;
};

export const ProfileItem = ({
  onClick,
  userId,
  profile,
  disabled,
}: ProfileItemProps) => {
  return (
    <Button
      variant="naked"
      gap="calc(var(--spacing) * 1.5)"
      before={
        <ProfileImage
          size="sm"
          imageUrl={profile?.image?.imageUrl}
          id={userId}
        />
      }
      onClick={onClick}
      disabled={disabled}
    >
      {profile?.displayName || "Anonymous User"}
    </Button>
  );
};
