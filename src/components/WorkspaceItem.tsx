import { useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { authStore } from "../@modules/stores/auth";
import { profileStore } from "../@modules/stores/profile";
import { Workspace } from "../@modules/types/workspaces";

import { ProfileImage } from "./ProfileImage";

export type WorkspaceItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  workspace?: Workspace;
  disabled?: boolean;
};

export const WorkspaceItem = ({
  onClick,
  workspace,
  disabled,
}: WorkspaceItemProps) => {
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);

  return (
    <Button
      variant="naked"
      gap="calc(var(--spacing) * 1.5)"
      before={
        <ProfileImage
          size="sm"
          emoji={workspace?.icon}
          imageUrl={
            workspace ? workspace.image?.imageUrl : profile?.image?.imageUrl
          }
          id={workspace?._id || user?.uid}
        />
      }
      onClick={onClick}
      disabled={disabled}
    >
      {workspace?.name || "Personal Workspace"}
    </Button>
  );
};
