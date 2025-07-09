import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function SetDefaultTheme() {
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    if (!theme) {
      setTheme("light");
    } 
    
  }, [theme]);

  return null
}