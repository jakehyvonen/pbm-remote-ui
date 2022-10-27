import './App.css';
import Container from '@material-ui/core/Container';
import Stream from './components/Stream/Stream';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import PhaserGame from './components/PhaserGame/PhaserGame';


function App() {
  const handle = useFullScreenHandle();

  return (
    <div className="App">    
      <button id="fsbutton" onClick={handle.enter}>
          Enter fullscreen
      </button>
      <FullScreen handle={handle}>
        <div id="container">
          <Container id="stream">
            <Stream></Stream>
          </Container>
          <div id="phasergame">
            <PhaserGame ></PhaserGame>
          </div>
        </div>
      </FullScreen>      
    </div>
  );
}

export default App;
