import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("team1@demo.com");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      signIn(email, password);
      setError("");
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  }

  return (
    <section className="page-section" style={{ maxWidth: 400 }}>
      <h1 className="page-title">Sign In</h1>
      <p className="page-subtitle">
        Use the demo account or your future database account.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p style={{ color: "red", fontSize: 13 }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
          Sign In
        </button>
      </form>
    </section>
  );
}
