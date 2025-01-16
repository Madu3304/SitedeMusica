// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container'); 
const prevAndNextContainer = document.querySelector('#prev-and-next-container');


//letras das musicas
const apiURL = `https://api.lyrics.ovh`

//limpando o codigo... tinha o termo ##await fetch## repetindo, agora não vai ser preciso repetir com essa função
const fetData = async url =>{ const response = await fetch(url)
  return await response.json()}

const getMoreSongs = async url => {
  const data = await fetData(`https://cors-anywhere.herokuapp.com/${url}`)
  console.log(data)
  insertSongsIntoPage(data)
  //https://cors-anywhere.herokuapp.com/corsdemo caso ocorra erro de novo.
}

const insertSongsIntoPage = songsInfo => {
    //converter a string para ir na tela
  // console.log(songsInfo.data.map(song => '<li>${song.title}</li>').join(''))

  songsContainer.innerHTML = songsInfo.data.map(song => `
    <li class="song">
    <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver Letra</butto>
    </li>
    `).join('')

 
    if(songsInfo.prev || songsInfo.next) { 
      prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
        ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ''}`
        return
    }
  
    prevAndNextContainer.innerHTML = ''
}

//função
const fetchSongs = async (term) => {
    try {const data = await fetData(`${apiURL}/suggest/${term}`);
      
      insertSongsIntoPage(data)

    } catch (error) {
      console.error('Ocorreu um erro:', error);
      songsContainer.innerHTML = '<li class="warning-message">Ocorreu um erro, aguarde.</li>';
    }
  };


form.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const searchTerm = searchInput.value.trim();
  
    if (!searchTerm) {
      songsContainer.innerHTML = '<li class="warning-message">Por favor, digite um termo válido</li>';
      return;
    }
  
    fetchSongs(searchTerm);
    songsContainer.scrollIntoView({ behavior: 'smooth' });
  });
  

  const fetchLyrics = async (artist, songTitle) => {
    const data = await fetData(`${apiURL}/v1/${artist}/${songTitle}`)

    //ajustar as caracteristicas do texto. 
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>') 
    //replace aqui vai substituir um caracter por outro


    songsContainer.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle}</strong> - ${artist}</h2>  
      <p class="lyrics">${lyrics}</p>
    </li>    
    `
  }

songsContainer.addEventListener('click', event=> { 
  const clickedElement = event.target

  if(clickedElement.tagName === 'BUTTON'){
    const artist = clickedElement.getAttribute('data-artist')
    const songTitle = clickedElement.getAttribute('data-song-title')

    prevAndNextContainer.innerHTML = ''
    fetchLyrics(artist, songTitle)
  }
})

