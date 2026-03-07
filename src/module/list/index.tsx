import { Route, Routes } from "react-router";
import AdminListPage from "./pages/admin-list";
import CreateList from "./pages/create-list";
import ProtectedRoutes from "@/components/protected-routes";

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS"]} />}>
        <Route index element={<AdminListPage />} />
      </Route>
    </Routes>
  );
}

export function ListRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS", "OWNER"]} />
        }
      >
        <Route path="create" element={<CreateList />} />
      </Route>
    </Routes>
  );
}
