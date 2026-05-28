export default function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"28px 0 14px" }}>
      <div style={{ width:3, height:14, background:"#8B2020", borderRadius:2 }} />
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#8B2020", textTransform:"uppercase" }}>
        {children}
      </span>
      <div style={{ flex:1, height:1, background:"linear-gradient(to right,#8B202020,transparent)" }} />
    </div>
  );
}
