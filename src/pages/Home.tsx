import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import SaveCurrentRouter from "@/components/SaveCurrentRouter";
import SetDefaultTheme from "@/components/SetDefaultTheme";

export default function Home() {
  return (
    <main className="min-h-screen home-page">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 29px)" }}>
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
