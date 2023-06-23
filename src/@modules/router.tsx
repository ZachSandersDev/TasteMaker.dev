import React, {
  FunctionComponent,
  LazyExoticComponent,
  PropsWithChildren,
  Suspense,
} from "react";
import {
  Navigate,
  Outlet,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom";

import Loading from "../components/Loading";
import Shell from "../components/Shell";
import LoginView from "../views/Login";

const PublicRecipeView = React.lazy(() => import("../views/PublicRecipeView"));
const RecipeDetailsView = React.lazy(
  () => import("../views/Recipe/RecipeDetails")
);
const FolderView = React.lazy(() => import("../views/Folder"));
const SettingsView = React.lazy(() => import("../views/Settings/SettingsView"));
const ShoppingListDetailsView = React.lazy(
  () => import("../views/ShoppingList/ShoppingListDetails")
);
const ShoppingListsView = React.lazy(
  () => import("../views/ShoppingList/ShoppingLists")
);
const WorkspaceSettings = React.lazy(
  () => import("../views/WorkspaceSettings")
);

const LazyRoute: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
      <Outlet />
    </Suspense>
  );
};

const routes: RouteObject[] = [
  {
    element: <Shell />,
    children: [
      {
        path: "/recipes",
        element: (
          <LazyRoute>
            <FolderView />
          </LazyRoute>
        ),
      },
      {
        path: "/folder/:folderId",
        element: (
          <LazyRoute>
            <FolderView />
          </LazyRoute>
        ),
      },
      {
        path: "recipe/:recipeId",
        element: (
          <LazyRoute>
            <RecipeDetailsView />
          </LazyRoute>
        ),
      },
      {
        path: "shopping-lists",
        element: (
          <LazyRoute>
            <ShoppingListsView />
          </LazyRoute>
        ),
      },
      {
        path: "shopping-list/:listId",
        element: (
          <LazyRoute>
            <ShoppingListDetailsView />
          </LazyRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <LazyRoute>
            <SettingsView />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    path: "/workspace/:userId/:workspaceId",
    element: (
      <LazyRoute>
        <WorkspaceSettings />
      </LazyRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/public/:userId/recipe/:recipeId",
    element: (
      <LazyRoute>
        <PublicRecipeView />
      </LazyRoute>
    ),
  },
  {
    path: "/public/workspace/:userId/:workspaceId/recipe/:recipeId",
    element: (
      <LazyRoute>
        <PublicRecipeView />
      </LazyRoute>
    ),
  },

  {
    path: "*",
    element: <Navigate replace to="/recipes" />,
  },
];

const Dialogs: [string, LazyExoticComponent<() => JSX.Element | null>][] = [
  [
    "icon-picker",
    React.lazy(() => import("../components/Dialogs/IconPickerDialog")),
  ],
  [
    "recipe-selector",
    React.lazy(() => import("../components/Dialogs/RecipeSelectorDialog")),
  ],
  [
    "text-input",
    React.lazy(() => import("../components/Dialogs/TextInputDialog")),
  ],
];

function attachModalsToRoutes(routes: RouteObject[]): RouteObject[] {
  const createModalSubroutes = (): RouteObject[] => {
    return Dialogs.map(([path, Dialog]) => ({
      path: `modal/${path}`,
      element: (
        <LazyRoute>
          <Dialog />
        </LazyRoute>
      ),
    }));
  };

  for (const route of routes) {
    if (route.children) {
      route.children = attachModalsToRoutes(route.children).concat(
        ...createModalSubroutes()
      );
    } else {
      route.children = createModalSubroutes();
    }
  }

  return routes;
}

const router = createBrowserRouter(attachModalsToRoutes(routes));

export default router;
