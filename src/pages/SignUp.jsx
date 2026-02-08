import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamId, setTeamId] = useState("T01");
  const [carModel, setCarModel] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    signUp(name, email, password, teamId, carModel);
    navigate("/profile");
  }

  return (
    <section className="page-section" style={{ maxWidth: 420 }}>
      <h1 className="page-title">Sign Up</h1>
      <p className="page-subtitle">
        Create an account and link it to your team and car model.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name:
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Team ID:
          <input
            type="text"
            required
            placeholder="e.g. T01"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
        </label>

        <label>
          Car model:
          <input
            type="text"
            required
            placeholder="e.g. MazeCar v1"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
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

        <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
          Sign Up
        </button>
      </form>
    </section>
  );
}
