import './App.css';
import Container from '@material-ui/core/Container';
import Stream from './components/Stream/Stream';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  const handle = useFullScreenHandle();

  return (
    <div className="App">    
      <button id="fsbutton" onClick={handle.enter}>
          Enter fullscreen
      </button>
      <FullScreen handle={handle}>
        <Container id="stream">
          <Stream></Stream>
        </Container>
      </FullScreen>      
    </div>
  );
}

export default App;
