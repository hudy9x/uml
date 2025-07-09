import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import SaveCurrentRouter from "@/components/SaveCurrentRouter";
import SetDefaultTheme from "@/components/SetDefaultTheme";

export default function Home() {
  return (
    <main className="min-h-screen home-page flex flex-col">
      <div className="home-wrapper flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
      <SaveCurrentRouter />
      <SetDefaultTheme />
    </main>
  );
}
