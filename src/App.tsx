import "./App.css";
import AuthPage from "./module/auth/pages/auth";
import { AppSidebar } from "./components/custom/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";

function App() {
  return (
    <SidebarProvider open={false}>
      <AppSidebar />
      <SidebarInset>
        {/* <header className="flex h-14 items-center border-b px-4"> */}
          <SidebarTrigger className="md:hidden" />
        {/* </header> */}
        <div className="a">
          <AuthPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
