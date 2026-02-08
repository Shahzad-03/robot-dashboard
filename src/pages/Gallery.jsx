export default function Gallery() {
  return (
    <section>
      <h1>Gallery</h1>
      <p>Photos/videos of the robot and maze.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
        {Array.from({length:8}).map((_,i)=>(
          <div key={i} style={{ border:"1px dashed #aaa", aspectRatio:"1/1", display:"grid", placeItems:"center" }}>
            Thumbnail
          </div>
        ))}
      </div>
    </section>
  );
}
