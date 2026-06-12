import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { RootLayout } from "./RootLayout"
import App from "./App"

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

function isSemaphorHostedRuntime() {
  if (typeof window === "undefined") return false

  // Semaphor injects this runtime object when the published app is loaded
  // inside the hosted console/embed iframe. In that mode the browser URL belongs
  // to Semaphor, so the app should use memory history instead of treating the
  // console path as a TanStack Router route.
  return Boolean(
    (window as Window & { __SEMAPHOR_DATA_APP_RUNTIME__?: unknown })
      .__SEMAPHOR_DATA_APP_RUNTIME__,
  )
}

export const router = createRouter(
  isSemaphorHostedRuntime()
    ? {
        routeTree,
        history: createMemoryHistory({ initialEntries: ["/"] }),
      }
    : { routeTree },
)

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
