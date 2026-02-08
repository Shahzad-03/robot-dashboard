export default function Status() {
  return (
    <section>
      <h1>Robot Status</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
        <div style={{ border:"1px solid #ddd", padding:12 }}>
          <strong>Connection</strong>
          <p>MQTT: disconnected</p>
          <p>Last ping: —</p>
        </div>
        <div style={{ border:"1px solid #ddd", padding:12 }}>
          <strong>Power</strong>
          <p>Battery: 82%</p>
        </div>
        <div style={{ border:"1px solid #ddd", padding:12 }}>
          <strong>Motors</strong>
          <p>Left/Right: OK</p>
        </div>
      </div>
      <div style={{ marginTop:16, border:"1px solid #ddd", padding:12, height:220, display:"grid", placeItems:"center" }}>
        2D Maze/Path placeholder
      </div>
    </section>
  );
}
