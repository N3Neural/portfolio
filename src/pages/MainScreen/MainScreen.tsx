import React from "react";

const MainScreen: React.FC = () => {
  return (
    <div style={{ 
      color: "white", 
      padding: "2rem", 
      height: "100vh", 
      backgroundColor: "rgba(0, 0, 0, 0.25)", 
      position: "relative",
      zIndex: 2
    }}>
      <header>
        <h1>Welcome to My Portfolio</h1>
        <nav>
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", padding: 0, marginTop: "1rem" }}>
            <li><a href="#about" style={{ color: "#00ff00", textDecoration: "none" }}>About</a></li>
            <li><a href="#projects" style={{ color: "#00ff00", textDecoration: "none" }}>Projects</a></li>
            <li><a href="#skills" style={{ color: "#00ff00", textDecoration: "none" }}>Skills</a></li>
            <li><a href="#contact" style={{ color: "#00ff00", textDecoration: "none" }}>Contact</a></li>
          </ul>
        </nav>
      </header>
      <main style={{ marginTop: "3rem" }}>
        <section>
          <h2>Software Developer & Competitive Programmer</h2>
          <p>This is where your portfolio content will be displayed. Update as needed.</p>
        </section>
      </main>
    </div>
  );
};

export default MainScreen;