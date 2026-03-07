import { Route, Routes } from "react-router";
import User from "./pages/user";
import UserDetail from "./pages/user-detail";
import ProtectedRoutes from "@/components/protected-routes";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={["ADMIN", "BIGBOSS"]} />}>
        <Route index element={<User />} />
        <Route path=":id" element={<UserDetail />} />
      </Route>
    </Routes>
  );
}
