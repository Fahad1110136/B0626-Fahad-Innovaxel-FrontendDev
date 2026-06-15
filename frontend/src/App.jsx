import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage    from "./pages/LoginPage.jsx";
import SignupPage   from "./pages/SignupPage.jsx";
import HomePage     from "./pages/HomePage.jsx";
import ExpenseTracker from "./AppShell.jsx";

export default function App() {
  const { user } = useAuth();

  const [page, setPage] = useState("home");

  if (user) {
    return <ExpenseTracker />;
  }

  if (page === "login") {
    return (
      <LoginPage
        onSwitch={() => setPage("signup")}
        onBack={()   => setPage("home")}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onSwitch={() => setPage("login")}
        onBack={()   => setPage("home")}
      />
    );
  }

  return (
    <HomePage
      onLogin={()  => setPage("login")}
      onSignup={() => setPage("signup")}
    />
  );
}
