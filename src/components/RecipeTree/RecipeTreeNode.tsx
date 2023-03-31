import { useState } from "react";
import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import { motion } from "framer-motion";

import { TreeNode } from "../../@modules/types/treeNode";
import { RecipeItem } from "../RecipeItem";

import "./RecipeTreeNode.scss";
import { useNavigate } from "react-router-dom";

export type RecipeNodeProps = {
  className?: string;
  node: TreeNode;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
  onTextChange: (id: number, text: string) => void;
};

export const RecipeNode = ({
  className,
  node: { id, text, data },
  isOpen,
  onToggle,
  onTextChange,
}: RecipeNodeProps) => {
  const [editingText, setEditingText] = useState(false);
  const [localText, setLocalText] = useState(text);
  const navigate = useNavigate();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data) {
      onToggle(id);
    }
  };

  const dragOverProps = useDragOver(id, isOpen, onToggle);

  return (
    <motion.div
      layout="position"
      className={[data ? "" : "recipe-tree-node", className]
        .filter((s) => !!s)
        .join(" ")}
      onClick={handleToggle}
      {...dragOverProps}
    >
      {data ? (
        <RecipeItem
          recipeId={data}
          onClick={() => navigate(`/recipe/${data}`)}
        />
      ) : (
        <>
          <span className="material-symbols-rounded recipe-tree-node-icon">
            {isOpen ? "folder_open" : "folder"}
          </span>
          {editingText ? (
            <input
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              onKeyUp={(e) => {
                if (e.code === "Enter") {
                  setEditingText(false);
                  onTextChange(id as number, localText);
                }
              }}
            />
          ) : (
            <span onDoubleClick={() => setEditingText(true)}>{localText}</span>
          )}
        </>
      )}
    </motion.div>
  );
};
