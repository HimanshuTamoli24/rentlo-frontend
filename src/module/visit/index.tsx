import { Route, Routes } from "react-router";
import MyVisitsPage from "./pages/my-visits";
import ProtectedRoutes from "@/components/protected-routes";

export default function VisitRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoutes
            allowedRoles={["TENANT", "ADMIN", "BIGBOSS", "OWNER"]}
          />
        }
      >
        <Route index element={<MyVisitsPage />} />
      </Route>
    </Routes>
  );
}
