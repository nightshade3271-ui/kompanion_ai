import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";
import Memory from "@/pages/Memory";
import Tools from "@/pages/Tools";
import CalendarCallback from "@/pages/CalendarCallback";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Chat} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/memory"} component={Memory} />
      <Route path={"/tools"} component={Tools} />
      <Route path="/calendar/callback" component={CalendarCallback} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
