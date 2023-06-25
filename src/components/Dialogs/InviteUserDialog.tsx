import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";

import { getUserIdFromEmail } from "../../@modules/api/emailMap";
import { useProfile } from "../../@modules/hooks/profile";
import { InviteUserDialog } from "../../@modules/stores/dialogs";

import "./InviteUserDialog.scss";
import { useSWR } from "../../@modules/utils/cache.react";
import { ProfileItem } from "../ListItems/ProfileItem";
import Spinner from "../Spinner";

export function useInviteUser() {
  const navigate = useNavigate();

  return (payload: { title: string; placeholder: string; value?: string }) =>
    new Promise<string | undefined>((resolve, reject) => {
      navigate("modal/invite-user");
      setRecoil(InviteUserDialog, { resolve, reject, payload });
    });
}

export default function InviteUserComponent() {
  const [
    {
      resolve,
      reject,
      payload: { title = "", placeholder = "", value = undefined } = {},
    },
    setDialogState,
  ] = useRecoilState(InviteUserDialog);
  const navigate = useNavigate();

  const [localValue, setLocalValue] = useState<string>(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const { loading: newMemberIdLoading, value: newMemberId } = useSWR<string>(
    `/email_to_id/${localValue}`,
    () => getUserIdFromEmail(localValue)
  );

  const { profileLoading: newMemberProfileLoading, profile: newMemberProfile } =
    useProfile(newMemberId || "");

  useEffect(() => {
    if (resolve && reject && inputRef.current) {
      inputRef.current.focus();
    }
  }, [resolve, reject]);

  const resolveUserId = () => {
    if (!resolve) return;

    resolve(newMemberId);
    reset();
  };

  const reset = () => {
    setDialogState({});
    setLocalValue("");
    navigate(-1);
  };

  if (!resolve || !reject || !title || !placeholder) {
    return null;
  }

  return (
    <>
      <div className="ra-dialog ra-card invite-user-dialog">
        <header className="ra-card-header">
          <h2>{title}</h2>
        </header>

        <Input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Search by email address"
          after={
            <Button
              onClick={() => setLocalValue("")}
              variant="icon"
              size="sm"
              iconBefore="clear"
              type="button"
            />
          }
        />

        <div className="ra-list">
          {newMemberProfile && (
            <ProfileItem
              userId={newMemberId}
              profile={newMemberProfile}
              onClick={resolveUserId}
            />
          )}

          {(newMemberIdLoading || newMemberProfileLoading) && <Spinner />}
        </div>

        <div className="ra-actions">
          <Button onClick={reset} variant="naked" size="sm" type="button">
            Cancel
          </Button>
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={reset}></div>
    </>
  );
}
