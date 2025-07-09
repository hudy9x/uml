import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from "react";

export default function Home() {

  const location = useLocation();
  useEffect(() => {
    
    console.log(location.pathname);
    
  }, [location.pathname]);

  return (
    <main className="min-h-screen home-page flex flex-col">
      <div className="home-wrapper flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  );
}
