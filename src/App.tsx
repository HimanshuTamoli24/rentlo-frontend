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

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<ListPage />} />
        <Route path="/users" element={<User />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/listings/create" element={<CreateList />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
