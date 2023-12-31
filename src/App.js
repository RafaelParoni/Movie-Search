import {useState} from 'react'
// import Icons ----|
import { FiSearch, FiCopy } from 'react-icons/fi'
import { CiSquareRemove, CiBookmark } from 'react-icons/ci'
import {GrChannel, GrTrophy, GrValidate, GrPlay, GrMoney, GrLanguage, GrDocument, GrFolderOpen, GrCopy ,GrBook, GrUser, GrCaretNext, GrCaretPrevious} from 'react-icons/gr';
import {ImSpinner11} from 'react-icons/im'
import {FcHighPriority} from 'react-icons/fc'
import {TbBrandDisney, TbError404} from 'react-icons/tb'
import {SiPrime, SiNetflix, SiNow, SiApple} from 'react-icons/si'
// import Icons ----|

import './style.css';
import api from './services/api'
import posterError from './poster.jpg'
import axios from 'axios';

var busca = false
var errorValue = true;
var Pages = []
var PaginaAtual = 1
var Buttons = []
var displeyDefault = 'flex'
var nameMovie = ''
var ValorTotalDasPaginas = ''
var ValorDasPaginaAtual = '1'
var ValorTotalDeFilmes = ''
var PageResquest = 1
var Movie = []
var OndeAssistirResults = []
var OndeAssistirDetalhes = []
var MovieResults = []
var OndeAssistirLink = ''
var OndeAssistirIcon = ''

function App() {
  const [input, setInput] = useState('');
  const [filmInfo, setFilmInfo] = useState({});
 
  
  async function handleSearch(){
    //  12237837/json/

    if(busca == true){
      console.log('barrado')
      return
    }
    if(input === ''){ 
      alert('Digite o nome do filme!')
      return;
    }
    document.getElementById('ErrorSpan').style.display = 'none'
    document.getElementById('body').style.cursor = 'wait'
    document.getElementById('DivSearch').style.cursor = 'wait'
    document.getElementById('inputSearch').style.cursor = 'wait'
    document.getElementById('buttonSearch').style.cursor = 'wait'
    document.getElementById('SearchLoading').style.display = 'flex'
    document.getElementById('SearchDefault').style.display = 'none'
    document.getElementById('inputSearch').setAttribute('readonly', 'on')
    
    try{
      if( PaginaAtual !== 1){
        for(const key in Movie[PaginaAtual]){
          document.getElementById(`page${PaginaAtual} m${key}`).style.display = 'none'
        }
        for(const key in Movie[1]){
          document.getElementById(`page${1} m${key}`).style.display = 'flex'
        }
        document.getElementById('NumberMovies').innerHTML = 'Atualizando'
        document.getElementById('NumberPages').innerHTML = 1
      }
      errorValue = true
      PaginaAtual = 1
      Pages = []
      Buttons = []
      Movie = []
      MovieResults = []
      busca = true
      displeyDefault = 'flex'
      PageResquest = 1;
      totalPaginas = 1;
      nameMovie = input.toLowerCase()
      nameMovie = nameMovie.trim()
      var totalPaginas = 0
      console.log('buscando')
      while(totalPaginas < PageResquest){
        var page = PageResquest.toString()
        const response = await api.get(`?s=${nameMovie}&page=${page}&apikey=c74f3650&plot=full`);
  
        if(response.data.Search.length == 10){
          if(PageResquest >= 11){break}
          Movie[PageResquest] = response.data.Search
          for(const key in response.data.Search){
            Pages.push(
              <div className='MovieCard' style={{display: displeyDefault}}  id={`page${PageResquest} m${key}`} onClick={() => movieDetais(key)}>
                <img  name='card' src={Movie[PageResquest][key].Poster}></img>
                <p for="card"> {Movie[PageResquest][key].Title} </p>
              </div>
  
            )
          }
          displeyDefault = 'none'
          PageResquest++
          totalPaginas++
        }else {
          if(PageResquest >= 11){break}
          Movie[PageResquest] = response.data.Search

          for(const key in response.data.Search){
            Pages.push(
              <>
                  <div className='MovieCard' onClick={() => movieDetais(key)} style={{display: displeyDefault}} id={`page${PageResquest} m${key}`}>
                    <img  name='card' src={Movie[PageResquest][key].Poster}></img>
                    <p for="card"> {Movie[PageResquest][key].Title} </p>
                  </div>
          
              </>
            )
          
          }
         // PageResquest++
          totalPaginas++
  
        }   
      }
      if(Movie.length <= 3){
        var i = 0
        if(totalPaginas == 1 ){
          Buttons.push(
            <div className='BtnPages'>
              <span>No Pages</span>
            </div>
          )
        }else{
          Buttons.push(
            <div className='BtnPages'>
              <button id='return' onClick={()=> MudarPagina('return')}><GrCaretPrevious/></button>
              <button id='next' onClick={()=> MudarPagina('next')}><GrCaretNext/> </button>
            </div>
        )
        }
      }else{
        Buttons.push(
          <div className='BtnPages'>
              <button id='return'  onClick={()=> MudarPagina('return')} ><GrCaretPrevious/></button>
              <button id='next' onClick={()=> MudarPagina('next')} ><GrCaretNext/> </button>
          </div>
        )
      }
      
      busca = false
      ValorTotalDasPaginas = `${totalPaginas}`
      ValorDasPaginaAtual = '1'
      ValorTotalDeFilmes = Movie[ValorDasPaginaAtual].length
      if(document.getElementById('NumberMovies') !== null){document.getElementById('NumberMovies').innerHTML = Movie[PaginaAtual].length}
      //if(response.data.Response == 'False'){errorValue = false; setFilm({}); movie = input }else {errorValue = true}
      document.getElementById('DivSearch').style.cursor = 'default'
      document.getElementById('inputSearch').style.cursor = 'auto'
      document.getElementById('buttonSearch').style.cursor = 'pointer'
      document.getElementById('body').style.cursor = 'auto'
      document.getElementById('SearchLoading').style.display = 'none'
      document.getElementById('SearchDefault').style.display = 'flex'
      document.getElementById('inputSearch').removeAttribute('readonly', 'on')
      setInput('');
    }catch(err){
      busca = false
      document.getElementById('DivSearch').style.cursor = 'default'
      document.getElementById('inputSearch').style.cursor = 'auto'
      document.getElementById('buttonSearch').style.cursor = 'pointer'
      document.getElementById('body').style.cursor = 'auto'
      document.getElementById('SearchLoading').style.display = 'none'
      document.getElementById('SearchDefault').style.display = 'flex'
      document.getElementById('inputSearch').removeAttribute('readonly', 'on')
      errorValue = false
      setInput('');
      console.log(`ERROR: ${err}`)
      document.getElementById('ErrorA').innerHTML = ` Error: ${err}`
      document.getElementById('ErrorSpan').style.display = 'block'
      
      
    }

    async function movieDetais(value){
      document.getElementById('body').style.cursor = 'wait'
      setFilmInfo({})
      var id = Movie[PaginaAtual][value].imdbID
      id = id.toString()
      try{
        const response = await api.get(`?i=${id}&apikey=c74f3650&plot=full`)
        
        
        if(response.data.Response == 'True'){
          const options = {
            method: 'GET',
            url: 'https://streaming-availability.p.rapidapi.com/search/title',
            params: {
              title: response.data.Title,
              country: 'us',
              show_type: 'all',
              output_language: 'en'
            },
            headers: {
              'X-RapidAPI-Key': '4d1fc03470msh98ed2d469a33f37p102184jsn7cab8e913b66',
              'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
          };
      
          try {
            const responseOndeAssisitr = await axios.request(options);
            OndeAssistirResults = responseOndeAssisitr.data.result[0]
            console.log(OndeAssistirResults)
            if(OndeAssistirResults !== undefined || OndeAssistirResults !== ''){
              OndeAssistirResults = OndeAssistirResults.streamingInfo.us[0].service
              OndeAssistirLink = responseOndeAssisitr.data.result[0].streamingInfo.us[0].link
              if(OndeAssistirResults == 'prime'){
                OndeAssistirIcon = <SiPrime/>
                console.log(OndeAssistirIcon)
              }else if(OndeAssistirResults == 'netflix' ){
                OndeAssistirIcon = <SiNetflix/>
                console.log(OndeAssistirIcon)
              }else if(OndeAssistirResults == 'now' ){
                OndeAssistirIcon = <SiNow/>
                console.log(OndeAssistirIcon)
              }else if(OndeAssistirResults == 'apple'){
                OndeAssistirIcon = <SiApple/>
                console.log(OndeAssistirIcon)
              }else if(OndeAssistirResults == 'disney'){
                OndeAssistirIcon = <TbBrandDisney/>
                console.log(OndeAssistirIcon)
              }
              console.log(OndeAssistirLink)
              console.log(OndeAssistirResults)
          
            }else{
              OndeAssistirIcon = <TbError404 size={25}/>
              OndeAssistirResults = 'Not Found'
              OndeAssistirLink = '#'
            
            }
          } catch (error) {
            OndeAssistirIcon = <TbError404 size={25}/>
            OndeAssistirResults = 'Not Found'
            OndeAssistirLink = '#'
          }

          setFilmInfo(response.data)
          document.getElementById('body').style.cursor = 'auto'
        }else{
          setFilmInfo({})
          document.getElementById('body').style.cursor = 'auto'
        }

        
        
      }catch{
        console.log('error ao buscando')
        document.getElementById('body').style.cursor = 'auto'
      }
    }
    async function MudarPagina(value){
      if(value == 'return'){

        if(PaginaAtual <= 1){
          
        }else{
          for(const key in Movie[PaginaAtual]){
            document.getElementById(`page${PaginaAtual} m${key}`).style.display = 'none'
          }
          PaginaAtual -= 1
          for(const key in Movie[PaginaAtual]){
            document.getElementById(`page${PaginaAtual} m${key}`).style.display = 'flex'
          }
        }
        document.getElementById('NumberPages').innerHTML = PaginaAtual
        document.getElementById('NumberMovies').innerHTML = Movie[PaginaAtual].length
      }else if(value == 'next'){
        if(PaginaAtual >= totalPaginas){
          
        }else{
          for(const key in Movie[PaginaAtual]){
            document.getElementById(`page${PaginaAtual} m${key}`).style.display = 'none'
          }
          PaginaAtual += 1
          for(const key in Movie[PaginaAtual]){
            document.getElementById(`page${PaginaAtual} m${key}`).style.display = 'flex'
          }
        }
        document.getElementById('NumberPages').innerHTML = PaginaAtual
        document.getElementById('NumberMovies').innerHTML = Movie[PaginaAtual].length
      }
    }
  
  }

  function location(){
    // window.location.assign(OndeAssistirLink)
    if(OndeAssistirLink == '#'){
      alert('Could not find the movie')
    }else{
      window.open(OndeAssistirLink);
    }
  }
  


  return (
    <div className="center">
      
      <h1>Search a movie:</h1>
      <div className="containerInput" id='DivSearch'>
          <textarea 
          id='inputSearch'
          type="text"
          placeholder="Film's name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete='off'
          maxLength={20}
          rows={1}
          wrap='off'
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleSearch()
            }
            }}
          />
          <button className="buttonSearch" id='buttonSearch' onClick={handleSearch}>
            <a id='SearchLoading' ><ImSpinner11 size={25} color='FFF'/></a>
            <a id='SearchDefault' ><FiSearch size={25} color='FFF'/></a>
          </button>
      </div>
      <button id="ErrorSpan"> <FcHighPriority className='teste'/> <a id='ErrorA'></a> </button>
      {Movie.length > 0 &&( // Buscar Filmes
        <div className='MovieResults'> 
          <span><GrFolderOpen/>Page: <p id='NumberPages'> {ValorDasPaginaAtual}</p>/{ValorTotalDasPaginas}  <GrDocument/> Movies: <p id='NumberMovies'> {ValorTotalDeFilmes} </p> </span>
          <a>{Pages}</a>
          <a>{Buttons}</a>
        </div>

      )}
      {errorValue == false && ( // Error ao buscar Filmes
          <main className='resultError'>
            <div className='posterError'>
              <img src={posterError}/>
            </div>
            <span><b>{nameMovie}</b> not found :c</span>
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
              <div className='SearchCenterInfo' onClick={()=> location({OndeAssistirResults})}> <a> <GrPlay/> watch on :</a> <a className='SearchCenterInfoTitle'> {OndeAssistirIcon} {OndeAssistirResults} </a></div> 
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
                }}> <GrCopy size={25} color='000'/> </button><span  id='copyName'>copied movie name </span> </h2>
              <p>{filmInfo.Plot}</p>
              <span><GrChannel/> Released: {filmInfo.Released}</span>
            </div>
          </div>
          <div className='ButtomInfo'>
            <a className='InfoOne'>
              <span> <GrMoney/> {filmInfo.BoxOffice} </span>
            </a>
            <a className='InfoTwo'>
              <span><GrLanguage/> Language: {filmInfo.Language}</span>
              <span><GrBook/> Genre: {filmInfo.Genre}</span>
              <span><GrUser/> Director: {filmInfo.Director}</span>
            </a> 
            <a className='InfoThree'>
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
