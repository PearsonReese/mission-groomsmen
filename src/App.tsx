import { Terminal } from "@/components/Terminal";
import { AdminDashboard } from "@/components/AdminDashboard";
import "./index.css";

export function App() {
  // Simple client-side routing for admin dashboard
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname === '/admin/';
  
  if (isAdminRoute) {
    return <AdminDashboard />;
  }
  
  return <Terminal />;
}

export default App;
