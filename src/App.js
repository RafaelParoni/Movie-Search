import {useState} from 'react'
import { FiSearch } from 'react-icons/fi'
import './style.css';
import api from './services/api'
import posterError from './poster.jpg'
var errorValue = true;
function App() {
  const [input, setInput] = useState('');
  const [film, setFilm] = useState({});

  async function handleSearch(){
    //  12237837/json/

    if(input === ''){
      alert('Digite o nome do filme!')
      return;
    }
    

    try{
      const response = await api.get(`${input}&apikey=c74f3650&plot=full`);

      setFilm({
        one: response.data.Search[0],
        two: response.data.Search[1],
        three: response.data.Search[2],
        for: response.data.Search[3],
        five: response.data.Search[4],
      });
     
      if(response.data.Response == 'False'){errorValue = false; setFilm({}); }else {errorValue = true}
      setInput('');
    }catch{
      errorValue = false
      setInput('');
      setFilm({});
    }
  }return (
    <div className="center">
      <h1>Search a movie:</h1>

      <div className="containerInput">
          <input 
          type="text"
          placeholder="Film's name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSearch()
            }
            }}
          />
          <button className="buttonSearch" onClick={handleSearch}>
            <FiSearch size={25} color='FFF'/>
          </button>
      </div>
      {Object.keys(film).length > 0 && (
        <div className='results'>
          <div className='movie'>
          </div>
          <div className='page'>

          </div>
        </div>
      )}
      {errorValue == false && (
          <main className='main'>
            <div className='poster'>
              <img src={posterError}/>
          
            </div>
            <span>movie not found :c</span>
            <span>Try searching without name translation!</span>
          </main>
      )}
    </div>
  );
}

export default App;
