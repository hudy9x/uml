import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project';

const CACHED_ROUTE_KEY = 'last_uml_route';

export default function SaveCurrentRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useProjectStore();

  useEffect(() => {
    if (projects.length === 0) {
      navigate('/empty');
      return;
    }

    // If we're at the root path, check for cached route and redirect
    if (location.pathname === '/') {
      const cachedRoute = localStorage.getItem(CACHED_ROUTE_KEY);
      if (cachedRoute) {
        navigate(cachedRoute);
      } else {
        navigate(`/uml/${projects[0].id}`);
      }
      return;
    }

    // If the current path matches /uml/:umlId pattern, cache it
    if (location.pathname.startsWith('/uml/')) {
      localStorage.setItem(CACHED_ROUTE_KEY, location.pathname);
    }
  }, [location.pathname, navigate]);

  return null;
}
