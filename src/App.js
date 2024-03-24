import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Portfolio</h1>
      </header>
      <main className="App-main">
        <section id="about" className="section">
          <h2>About Me</h2>
          <p>Welcome to my portfolio! I'm a passionate developer...</p>
        </section>
        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="project">
            <h3>Project 1</h3>
            <p>Description of Project 1...</p>
          </div>
          <div className="project">
            <h3>Project 2</h3>
            <p>Description of Project 2...</p>
          </div>
          {/* Add more project items as needed */}
        </section>
        <section id="contact" className="section">
          <h2>Contact Me</h2>
          <p>Feel free to reach out to me at example@example.com...</p>
        </section>
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
