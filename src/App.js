import {useState} from 'react'
import { FiSearch } from 'react-icons/fi'
import './style.css';
import api from './services/api'
import posterError from './poster.jpg'
var errorValue = true;
function App() {
  const [input, setInput] = useState('')
  const [film, setFilm] = useState({});

  async function handleSearch(){
    //  12237837/json/

    if(input === ''){
      alert('Digite o nome do filme!')
      return;
    }

    try{
      const response = await api.get(`${input}&apikey=c74f3650`);
      setFilm(response.data);
      console.log(response.data);
      if(response.data.Plot == 'N/A'){response.data.Plot = 'plot not found...'}
      if(response.data.Language == 'N/A'){response.data.Language = 'default language not found...'}
      if(response.data.Runtime == 'N/A'){response.data.Runtime = 'not found...'}
      if(response.data.Released == 'N/A'){response.data.Released = 'not found...'}
      if(response.data.Response =='False'){errorValue = false; setFilm({}); }else{errorValue = true}
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
          />
          <button className="buttonSearch" onClick={handleSearch}>
            <FiSearch size={25} color='FFF'/>
          </button>
      </div>
      {Object.keys(film).length > 0 && (
          <main className='main'>
            <h2>{film.Title}</h2>
            <div className='poster'>
              <img src={film.Poster} />
              <div>  
                <h3> Runtime: {film.Runtime}</h3>
                <span>{film.Plot}</span>
                <span>Language: {film.Language}</span>
              </div>
            </div>
            <span>Released: {film.Released}</span>
            <span>Metas core: {film.Metascore}%</span>
  
          </main>
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
