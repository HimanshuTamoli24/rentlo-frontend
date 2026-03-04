import { useState } from "react";
import Login from "./components/login/login";
import Register from "./components/register/register";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded">
      <div className="mb-4">
        <button
          onClick={() => setMode("login")}
          className={`mr-2 px-3 py-1 ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`${mode === "register" ? "bg-green-600 text-white" : "bg-gray-100"} px-3 py-1`}
        >
          Register
        </button>
      </div>

      <div>{mode === "login" ? <Login /> : <Register />}</div>
    </div>
  );
}
