import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";

import { TextInputDialog } from "../../@modules/stores/dialogs";

import "./TextInputDialog.scss";

export function useGetText() {
  const navigate = useNavigate();

  return (payload: { title: string; placeholder: string; value?: string }) =>
    new Promise<string | undefined>((resolve, reject) => {
      navigate("modal/text-input");
      setRecoil(TextInputDialog, { resolve, reject, payload });
    });
}

export default function TextInputComponent() {
  const [
    {
      resolve,
      reject,
      payload: { title = "", placeholder = "", value = undefined } = {},
    },
    setDialogState,
  ] = useRecoilState(TextInputDialog);
  const navigate = useNavigate();

  const [localValue, setLocalValue] = useState<string>(value || "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resolve && reject && inputRef.current) {
      inputRef.current.focus();
    }
  }, [resolve, reject]);

  const handleSubmit = (e: FormEvent) => {
    if (!resolve) return;
    e.preventDefault();

    resolve(localValue);
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
      <div className="ra-dialog ra-card text-input-dialog">
        <header className="ra-card-header">
          <h2>{title}</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
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
          <div className="ra-actions">
            <Button onClick={reset} variant="naked" size="sm" type="button">
              Cancel
            </Button>
            <Button
              role="form-submit"
              iconBefore="save"
              variant="filled"
              size="sm"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
      <div className="ra-dialog-cover" onClick={reset}></div>
    </>
  );
}
