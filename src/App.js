import {useState} from 'react'
// import Icons ----|
import { FiSearch } from 'react-icons/fi'
import {FiCopy} from 'react-icons/fi'
import { CiSquareRemove } from 'react-icons/ci'
import {GrUser} from 'react-icons/gr'
import {GrBook} from 'react-icons/gr'
import {GrLanguage} from 'react-icons/gr';
import {GrChannel} from 'react-icons/gr';
import {GrTrophy} from 'react-icons/gr';
import {GrValidate} from 'react-icons/gr';
// import Icons ----|

import './style.css';
import api from './services/api'
import posterError from './poster.jpg'
var movie = ''
var errorValue = true;
var filmes = []
function App() {
  const [input, setInput] = useState('');
  const [film, setFilm] = useState({});
  const [filmInfo, setFilmInfo] = useState({});


  async function handleSearch(){
    //  12237837/json/
 
    if(input === ''){ 
      alert('Digite o nome do filme!')
      return;
    }
    try{
      filmes = []
      var value = input.toLowerCase()
      value = value.trim()
      const response = await api.get(`?s=${value}&apikey=c74f3650&plot=full`);

      setFilm(response.data.Search);

      for(const key in response.data.Search){
        if(key > 5){break}
        filmes.push(
          <a><div className='movie' onClick={() => movieDetais(response.data.Search[key])}>
          <img src={response.data.Search[key].Poster} />
          <p>{response.data.Search[key].Title}</p>
          </div></a>)
      };
      if(response.data.Response == 'False'){errorValue = false; setFilm({}); movie = input }else {errorValue = true}
      setInput('');
    }catch{
      errorValue = false
      setInput('');
      setFilm({});
    }

    async function movieDetais(value){
      setFilmInfo({})
      try{
        const response = await api.get(`?i=${value.imdbID}&apikey=c74f3650&plot=full`)
        
        if(response.data.Response == 'True'){
          setFilmInfo(response.data)

        }else{
          setFilmInfo({})
        }
      }catch{
        
      }
    }


  }return (
    <div className="center">
      
      <h1>Search a movie:</h1>

      <div className="containerInput" id='teste'>
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
      {Object.keys(film).length > 0 &&( // Buscar Filmes
        <div className='results'>
          <div className='movies'>
            {filmes}
          </div>
      </div>
      )}
      {errorValue == false && ( // Error ao buscar Filmes
          <main className='resultError'>
            <div className='posterError'>
              <img src={posterError}/>
            </div>
            <span><b>{movie}</b> not found :c</span>
            <span>Try searching without name translation!</span>
          </main>
      )}
      {Object.keys(filmInfo).length > 0 &&( // Buscar Detalhes
        
       <div className='MovieDetais' id='IdMovieDetais'>
        <span className='close'> <a onClick={() => setFilmInfo({})} > <CiSquareRemove  color='000' /> </a></span>
          <div className='centerInfo'>
            <a>
              <img src={filmInfo.Poster} />
              <span>Run time: {filmInfo.Runtime}</span>
            </a>
            <div>
              <h2>{filmInfo.Title} <button onClick={() => {
                navigator.clipboard.writeText(filmInfo.Title)
                document.getElementById('copyName').style.display = 'block'
                setTimeout(hiddenCopy, 1000)
                function hiddenCopy(){
                  var elementoo = document.getElementById('copyName')
                  if(elementoo == undefined){

                  }else{
                    elementoo.style.display = 'none'
                  }
                }
                }}> <FiCopy size={25} color='000'/> </button><span  id='copyName'>copied movie name </span> </h2>
              <p>{filmInfo.Plot}</p>
              <span><GrChannel/> Released: {filmInfo.Released}</span>
            </div>
          </div>
          <div className='ButtomInfo'>
            <a>
              <span><GrLanguage/> Language: {filmInfo.Language}</span>
              <span><GrBook/> Genre: {filmInfo.Genre}</span>
              <span><GrUser/> Director: {filmInfo.Director}</span>
            </a> 
            <a>
              <span><GrTrophy/> Awards: {filmInfo.Awards}</span>
              <span><GrValidate/> Metascore: {filmInfo.Metascore}</span>
            </a> 
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
