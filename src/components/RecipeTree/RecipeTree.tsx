import { DndProvider } from "react-dnd";
import { useRecoilValue } from "recoil";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";

import { saveTree } from "../../@modules/api/tree";
import { setLocalTree, treeStore } from "../../@modules/stores/tree";

import { RecipeNode } from "./RecipeTreeNode";

import "./RecipeTree.scss";
import { TreeNode } from "../../@modules/types/treeNode";
import { motion } from "framer-motion";

export default function RecipeTree() {
  const { tree } = useRecoilValue(treeStore);

  const onDrop = (newTree: TreeNode[]) => {
    setLocalTree(newTree);
    saveTree(newTree);
  };

  const onTextChange = (id: number, text: string) => {
    const newTree = structuredClone(tree);
    const node = newTree.find((tn) => tn.id === id);
    if (!node) throw "Could not find node " + id;

    node.text = text;
    setLocalTree(newTree);
    saveTree(newTree);
  };

  if (!tree.length) {
    return <span style={{ alignSelf: "center" }}>No recipes found yet!</span>;
  }

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={tree}
        rootId={-1}
        render={(node, { isOpen, onToggle }) => (
          <RecipeNode
            node={node}
            isOpen={isOpen}
            onToggle={onToggle}
            onTextChange={onTextChange}
          />
        )}
        onDrop={onDrop}
        classes={{
          root: "recipe-tree",
          dropTarget: "recipe-tree-drop-target",
        }}
        sort={false}
        enableAnimateExpand={true}
        insertDroppableFirst={false}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        dropTargetOffset={0}
        placeholderRender={(node) => (
          <RecipeNode
            className={"recipe-tree-dragging"}
            node={node}
            isOpen={false}
            onToggle={() => undefined}
            onTextChange={() => undefined}
          />
        )}
      />
    </DndProvider>
  );
}
