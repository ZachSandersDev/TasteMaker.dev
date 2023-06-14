import {
  RecipeRefParams,
  getRecipe,
  getRecipesWithParent,
  saveRecipe,
} from "../api/recipes";
import { Recipe } from "../types/recipes";
import { swrOnce } from "../utils/cache";
import { useSWR } from "../utils/cache.react";
import { quickStrHash } from "../utils/quickHash";

export function getRecipeCacheKey({
  userId,
  workspaceId,
  recipeId,
}: RecipeRefParams) {
  return `${userId}/${workspaceId}/recipes/${recipeId}`;
}

export function useRecipeList(recipeParams: RecipeRefParams[]) {
  const { loading: recipeListLoading, value: recipeList } = useSWR(
    `${quickStrHash(JSON.stringify(recipeParams))}/recipe-list`,
    () =>
      Promise.all(
        recipeParams.map((p) =>
          swrOnce(`${p.userId}/${p.workspaceId}/recipe`, () => getRecipe(p))
        )
      )
  );

  return {
    recipeListLoading,
    recipeList: recipeList?.filter((r): r is Recipe => !!r) || [],
  };
}

export function useRecipe(recipeParams: RecipeRefParams) {
  const {
    loading: recipeLoading,
    value: recipe,
    updateValue: updateRecipe,
  } = useSWR<Recipe>(
    getRecipeCacheKey(recipeParams),
    () => getRecipe(recipeParams),
    (r) => saveRecipe(recipeParams, r)
  );

  return { recipeLoading, recipe, updateRecipe };
}

export function useRecipesWithParent(
  recipeParams: RecipeRefParams,
  folderId?: string
) {
  const { userId, workspaceId } = recipeParams;

  const {
    loading: recipesLoading,
    value: recipes,
    revalidate: revalidateRecipes,
  } = useSWR<Recipe[]>(
    `${userId}/${workspaceId}/recipesWithParent/${folderId}`,
    () => getRecipesWithParent({ userId, workspaceId }, folderId)
  );

  return { recipesLoading, recipes, revalidateRecipes };
}
