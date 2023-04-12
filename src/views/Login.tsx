import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAccount, doLogin } from "../@modules/stores/auth";

import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";

import "./Login.scss";

export default function LoginView() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doLogin(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.toString());
    }
  };

  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await createAccount(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.toString());
    }
  };

  return (
    <AppView
      header={
        <AppHeader>
          <h1 className="login-title">EasyPea</h1>
        </AppHeader>
      }
    >
      <form onSubmit={login} className="login-form">
        <h2 className="ra-title">Login</h2>
        <input
          className="ra-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="ra-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <header className="ra-actions">
          <button className="chip-button" onClick={signUp}>
            Sign up
          </button>
          <button className="chip-button" formMethod="submit">
            Login
          </button>
        </header>
        <span className="ra-error-message">{error}</span>
      </form>
    </AppView>
  );
}
