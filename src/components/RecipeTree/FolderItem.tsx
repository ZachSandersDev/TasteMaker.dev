import { motion } from "framer-motion";

import { TreeNode } from "../../@modules/types/treeNode";

import "./FolderItem.scss";

export type FolderItemProps = {
  className?: string;
  node: TreeNode;
  onClick: () => void;
};

export const FolderItem = ({
  className,
  node: { text, data },
  onClick,
}: FolderItemProps) => {
  return (
    <motion.div
      layout="position"
      className={[data ? "" : "folder-item", className]
        .filter((s) => !!s)
        .join(" ")}
      onClick={onClick}
    >
      <span className="material-symbols-rounded">folder</span>
      <span>{text}</span>
    </motion.div>
  );
};
