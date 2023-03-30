import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { saveTree } from "../@modules/api/tree";
import { setLocalTree, treeStore } from "../@modules/stores/tree";
import { TreeNode } from "../@modules/types/treeNode";

import "./EmojiPickerDialog.scss";

export interface EmojiPickerDialogProps {
  treeNode: TreeNode;
}

export default function EmojiPickerDialog({
  treeNode,
}: EmojiPickerDialogProps) {
  const { tree } = useRecoilValue(treeStore);

  const [isOpen, setIsOpen] = useState(false);

  const setIcon = (e: EmojiClickData) => {
    setIsOpen(false);

    const newTree = structuredClone(tree);
    const node = newTree.find((tn) => tn.id === treeNode.id);
    if (!node || !node.data) throw "Could not find node " + treeNode.id;

    node.data.icon = e.emoji;
    setLocalTree(newTree);
    saveTree(newTree);
  };

  return (
    <>
      <button className="icon-button" onClick={() => setIsOpen(true)}>
        {treeNode.data?.icon}
      </button>

      {isOpen && (
        <>
          <div className="emoji-picker-dialog">
            <EmojiPicker
              autoFocusSearch
              onEmojiClick={setIcon}
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
            />
          </div>
          <div
            className="emoji-picker-cover"
            onClick={() => setIsOpen(false)}
          ></div>
        </>
      )}
    </>
  );
}
