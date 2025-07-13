import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProjectStore } from "@/stores/project";

const CACHED_ROUTE_KEY = "last_uml_route";

export default function SaveCurrentRouter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    if (projects.length === 0 && pathname !== "/empty") {
      console.log("no projects => redirect to empty");
      navigate("/empty");
      return;
    }
  }, [projects, navigate, pathname]);

  useEffect(() => {
    if (projects.length === 0) {
      return;
    }

    // If we're at the root path, check for cached route and redirect
    if (pathname === "/") {
      const cachedRoute = localStorage.getItem(CACHED_ROUTE_KEY);
      if (cachedRoute) {
        navigate(cachedRoute);
      } else {
        console.log("no cached route => redirect to first project", projects);
        navigate(`/uml/${projects[0].id}`);
      }
      return;
    }

    // If the current path matches /uml/:umlId pattern, cache it
    if (pathname.startsWith("/uml/")) {
      localStorage.setItem(CACHED_ROUTE_KEY, pathname);
    }
  }, [pathname, navigate, projects]);

  return null;
}
