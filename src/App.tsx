import "./App.css";
import AuthPage from "./module/auth/pages/auth";
import { AppSidebar } from "./components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Navigate, Outlet, Route, Routes } from "react-router";
import UserPage from "./module/user/pages/user";
import UserDetailPage from "./module/user/pages/user-detail";
import NotFoundPage from "./module/list/pages/not-found";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<AppLayout />}>
        <Route path="/users" element={<UserPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
