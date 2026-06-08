import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { RootLayout } from "./RootLayout"
import App from "./App"
import { SamplesLayout } from "./samples/SamplesLayout"
import { SamplesIndex } from "./samples/SamplesIndex"
import { OverviewPage } from "./samples/pages/OverviewPage"
import { FiltersPage } from "./samples/pages/FiltersPage"
import { TablesPage } from "./samples/pages/TablesPage"
import { StatesPage } from "./samples/pages/StatesPage"
import { KpisPage } from "./samples/pages/KpisPage"
import { ChartsPage } from "./samples/pages/ChartsPage"
import { MatrixPage } from "./samples/pages/MatrixPage"

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
})

const samplesLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/samples",
  component: SamplesLayout,
})

const samplesIndexRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "/",
  component: SamplesIndex,
})

const samplesOverviewRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "overview",
  component: OverviewPage,
})

const samplesFiltersRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "filters",
  component: FiltersPage,
})

const samplesTablesRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "tables",
  component: TablesPage,
})

const samplesStatesRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "states",
  component: StatesPage,
})

const samplesKpisRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "kpis",
  component: KpisPage,
})

const samplesChartsRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "charts",
  component: ChartsPage,
})

const samplesMatrixRoute = createRoute({
  getParentRoute: () => samplesLayoutRoute,
  path: "matrix",
  component: MatrixPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  samplesLayoutRoute.addChildren([
    samplesIndexRoute,
    samplesOverviewRoute,
    samplesFiltersRoute,
    samplesTablesRoute,
    samplesStatesRoute,
    samplesKpisRoute,
    samplesChartsRoute,
    samplesMatrixRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
