import "./App.css";
import AuthPage from "./module/auth/pages/auth";
import { AppSidebar } from "./components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Outlet, Route, Routes } from "react-router";
import User from "./module/user/pages/user";
import UserDetail from "./module/user/pages/user-detail";
import ListPage from "./module/list/pages/list";
import NotFoundPage from "./components/not-found";
import CreateList from "./module/list/pages/create-list";

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

import AdminListPage from "./module/list/pages/admin-list";

import ProtectedRoutes from "./components/protected-routes";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ListPage />} />

      {/* Authenticated routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          {/* Admin routes */}
          <Route
            element={<ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS"]} />}
          >
            <Route path="/admin" element={<AdminListPage />} />
            <Route path="/users" element={<User />} />
            <Route path="/users/:id" element={<UserDetail />} />
          </Route>

          {/* Owner routes */}
          <Route
            element={
              <ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS", "OWNER"]} />
            }
          >
            <Route path="/create-list" element={<CreateList />} />
            <Route path="/listings/create" element={<CreateList />} />
          </Route>

          {/* Any other routes... */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
