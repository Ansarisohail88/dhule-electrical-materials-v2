import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:"100vh",
      fontSize:"40px",
      fontWeight:"bold"
    }}>
      Dhule Electrical Materials
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
