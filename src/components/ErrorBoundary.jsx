import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth:640, margin:"80px auto", padding:"0 20px", fontFamily:"serif", color:"#1A1208" }}>
          <h2 style={{ color:"#c62828", marginBottom:8 }}>页面加载出错</h2>
          <pre style={{ fontSize:13, background:"#F9EFEF", padding:16, borderRadius:6, overflow:"auto" }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button onClick={() => window.location.reload()} style={{
            marginTop:16, padding:"8px 20px", background:"#8B2020", color:"#fff",
            border:"none", borderRadius:4, fontSize:14, cursor:"pointer", fontFamily:"inherit",
          }}>
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
