import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Profile() {
  const { user, getCurrentTeam } = useAuth();
  const team = getCurrentTeam();

  if (!user) {
    return (
      <section className="page-section">
        <h1 className="page-title">Your Profile</h1>
        <p className="page-subtitle">You are not signed in.</p>
        <p>
          <Link to="/signin">Sign in</Link> or{" "}
          <Link to="/signup">create an account</Link>.
        </p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <h1 className="page-title">Your Profile</h1>
      <p className="page-subtitle">Account and team details.</p>

      <div className="card" style={{ maxWidth: 480 }}>
        <h3>Account</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Team ID:</strong> {user.teamId || "—"}</p>
        <p><strong>Car model:</strong> {user.carModel || "—"}</p>
      </div>

      {team && (
        <div className="card" style={{ maxWidth: 480, marginTop: 16 }}>
          <h3>Team</h3>
          <p><strong>Team name:</strong> {team.name}</p>
          <p><strong>Members:</strong> {team.members.join(", ")}</p>
          <p><strong>Contact email:</strong> {team.contactEmail}</p>
        </div>
      )}
    </section>
  );
}
