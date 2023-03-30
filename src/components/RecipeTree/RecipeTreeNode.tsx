import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import { TreeNode } from "../../@modules/types/treeNode";
import { motion } from "framer-motion";

import "./RecipeTreeNode.scss";
import { useRecoilValue } from "recoil";
import { recipeStore } from "../../@modules/stores/recipes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const { recipes } = useRecoilValue(recipeStore);
  const navigate = useNavigate();

  const [editingText, setEditingText] = useState(false);
  const [localText, setLocalText] = useState(text);

  const recipe = data?.recipeId && recipes.find((r) => r._id === data.recipeId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (recipe) {
      navigate(`/recipe/${id}/${recipe._id}`);
    } else {
      onToggle(id);
    }
  };

  const dragOverProps = useDragOver(id, isOpen, onToggle);

  return (
    <motion.div
      layout="position"
      className={["recipe-tree-node", className].filter((s) => !!s).join(" ")}
      onClick={handleToggle}
      {...dragOverProps}
    >
      {!recipe && (
        <span className="material-symbols-rounded recipe-tree-node-icon">
          {isOpen ? "folder_open" : "folder"}
        </span>
      )}

      {data?.icon && <span className="recipe-tree-node-icon">{data.icon}</span>}

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
        <span onDoubleClick={() => setEditingText(true)}>
          {recipe ? recipe.name || "Untitled Recipe" : localText}
        </span>
      )}
    </motion.div>
  );
};
