import { useLocation, useNavigate } from "react-router";
export default function ProtectedRoutes() {
    
    const location = useLocation();
    const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Protected Routes</h1>
    </div>
  );
}
