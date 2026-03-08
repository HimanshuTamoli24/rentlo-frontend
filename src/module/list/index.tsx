import { Route, Routes } from "react-router";
import BigBossListPage from "./pages/bigboss-list";
import CreateList from "./pages/create-list";
import ProtectedRoutes from "@/components/protected-routes";
import OwnerTenant from "./pages/owner-tenant";

export function BigBossRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS"]} />}>
        <Route index element={<BigBossListPage />} />
      </Route>
    </Routes>
  );
}
export function OwnerTenantRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoutes
            allowedRoles={["ADMIN", "BIGBOSS", "OWNER", "TENANT"]}
          />
        }
      >
        <Route index element={<OwnerTenant />} />
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
