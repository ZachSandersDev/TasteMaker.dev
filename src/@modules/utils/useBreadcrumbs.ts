import { useRecoilValue } from "recoil";

import { useBreadcrumbStack } from "../stores/folders";
import { recipeStore } from "../stores/recipes";

import useMediaQuery from "./useMediaQuery";

export interface BreadcrumbLink {
  text: string;
  href?: string;
}

export function useBreadcrumbs(nodeId?: string) {
  const { recipes } = useRecoilValue(recipeStore);
  const recipe = recipes.find(r => r._id === nodeId);

  const stack = useBreadcrumbStack(recipe ? recipe.parent : nodeId);
  const isMobile = useMediaQuery("(max-width: 999px)");

  // Filter out curent entry for mobile
  const filteredCrumbs = isMobile ? stack.filter(s => s._id !== nodeId) : stack;

  const links: BreadcrumbLink[] = filteredCrumbs.map((n) => ({
    text: n.text || "Untitled Folder",
    // Don't link curent entry
    href: n._id === nodeId ? undefined : "/folder/" + n._id,
  }));

  if (recipe && !isMobile) {
    links.push({ text: recipe.name || "Untitled Recipe", });
  }

  return links;
}
