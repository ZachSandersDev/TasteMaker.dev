import { motion } from "framer-motion";

import { TreeNode } from "../../@modules/types/treeNode";

export type FolderItemProps = {
  className?: string;
  node: TreeNode;
  onClick: () => void;
};

export const FolderItem = ({
  className,
  node: { text, icon, data },
  onClick,
}: FolderItemProps) => {
  return (
    <motion.div
      layout="position"
      className={[data ? "" : "ra-option", className]
        .filter((s) => !!s)
        .join(" ")}
      onClick={onClick}
    >
      <span className="ra-option-icon">
        {icon || <i className="material-symbols-rounded">folder</i>}
      </span>
      <span>{text}</span>
    </motion.div>
  );
};
