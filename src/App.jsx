export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ color: "darkblue" }}>Maze Robot Dashboard</h1>
      <p>This is a simple version of your project website.</p>

      <section style={{ marginTop: 20 }}>
        <h2>Dashboard</h2>
        <p>Statistics and results will appear here later.</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Runs</h2>
        <table>
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Maze</th>
              <th>Algorithm</th>
              <th>Time</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1</td>
              <td>M-5 (12×12)</td>
              <td>DFS</td>
              <td>16.2 s</td>
              <td>Success</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
