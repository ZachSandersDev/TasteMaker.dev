export interface TreeNode {
  id: number | string;
  parent: number | string;
  text: string;
  icon?: string;
  droppable?: boolean;
  data?: string;
}