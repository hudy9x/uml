import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import "./App.css";

function App() {

  return (
    <main className="h-screen w-screen p-8 bg-gray-50">
      <Button>Click me</Button>
      <Input placeholder="Enter a URL" />
    </main>
  );
}

export default App;
