import { CanvasGame } from './components/CanvasGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Flappy Bird</h1>
      </header>
      <main className="App-main">
        <CanvasGame />
      </main>
    </div>
  );
}

export default App;
