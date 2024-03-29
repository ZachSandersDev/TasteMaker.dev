import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import Input from "../@design/components/Input/Input";

import { authStore, createAccount, doLogin } from "../@modules/stores/auth";

import AppView from "../components/Global/AppView";

import "./Login.scss";

export default function LoginView() {
  const navigate = useNavigate();
  const { user } = useRecoilValue(authStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/recipes");
    }
  }, [user]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await doLogin(email, password);
    } catch (err: any) {
      setError(err.toString());
    }
  };

  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await createAccount(email, password);
    } catch (err: any) {
      setError(err.toString());
    }
  };

  return (
    <AppView className="login-view" center>
      <h1 className="ra-app-title">TasteMaker.dev</h1>
      <form onSubmit={login} className="login-form">
        <h2 className="ra-title">Login</h2>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <header className="ra-actions">
          <Button variant="naked" type="button" onClick={signUp}>
            Sign up
          </Button>
          <Button variant="filled" type="submit">
            Login
          </Button>
        </header>
        <span className="ra-error-message">{error}</span>
      </form>
    </AppView>
  );
}
