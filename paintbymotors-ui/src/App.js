import logo from './logo.svg';
import './App.css';
import Container from '@material-ui/core/Container';
import Stream from './components/Stream/Stream';

function App() {
  return (
    <div className="App">    
      <Container id="stream">
        <Stream></Stream>
      </Container>
    </div>
  );
}

export default App;
