import "./App.css";
import AuthPage from "./module/auth/pages/auth";
import { AppSidebar } from "./components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Outlet, Route, Routes } from "react-router";
import ListPage from "./module/list/pages/list";
import NotFoundPage from "./components/not-found";
import ProtectedRoutes from "./components/protected-routes";

import UserRoutes from "./module/user";
import { AdminRoutes, ListRoutes } from "./module/list";
import VisitRoutes from "./module/visit";

function AppLayout() {
  return (
    <SidebarProvider open={false}>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="md:hidden" />
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import UnauthorizedPage from "./components/unauthorized-page";
import ListDetailPage from "./module/list/pages/detail-page";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ListPage />} />
      <Route path="/property/:id" element={<ListDetailPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/listings/*" element={<ListRoutes />} />
          <Route path="/users/*" element={<UserRoutes />} />
          <Route path="/visits/*" element={<VisitRoutes />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
