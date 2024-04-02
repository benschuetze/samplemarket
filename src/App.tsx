import "./App.css";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Header } from "./components/header";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Header />
        <ModeToggle />
        <Button variant="outline">Hallo mein Neger!</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
