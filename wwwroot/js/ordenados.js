
const form = document.querySelector('#form');
const songsContainer = document.querySelector('#songsContainer');
const submitVerAr = document.querySelector('#submitVerAr');
const submitVerGene = document.querySelector('#submitVerGene'); 

const apiURL = 'https://guilhermeonrails.github.io/api-csharp-songs/songs.json';

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar.');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

//colocar músicas
const insertSongsIntoPage = (songs) => {
    songsContainer.innerHTML = songs.map((song) => `
        <li class="song">
            <span class="song-artist"><strong>${song.artist}</strong></span>
        </li>
    `).join('');
};

const insertSongs = (songs) => {
    songsContainer.innerHTML = songs.map((song) => `
        <li class="song">
            <span class="song-genre"><strong>${song.genre}</strong></span>
        </li>
    `).join('');
};

//artistas
const sortArtists = (data) => {
    return data.sort((a, b) => {
        const artistA = a.artist.toLowerCase();
        const artistB = b.artist.toLowerCase();
        return artistA < artistB ? -1 : artistA > artistB ? 1 : 0;
    });
};

//gêneros
const sortGenres = (data) => {
    return data.sort((a, b) => {
        const genreA = a.genre.toLowerCase();
        const genreB = b.genre.toLowerCase();
        return genreA.localeCompare(genreB); 
    });
};

submitVerAr.addEventListener('click', async (event) => {
    event.preventDefault(); 
    const data = await fetchData(apiURL);
    if (!data) return;
    const sortedArtists = sortArtists(data);
    insertSongsIntoPage(sortedArtists);
});

submitVerGene.addEventListener('click', async (event) => {
    event.preventDefault(); 
    const data = await fetchData(apiURL);
    if (!data) return;
    const sortedGenres = sortGenres(data);
    insertSongs(sortedGenres);
});

// teste para deixar arrmado
const fetchLyrics = async (artist, genre) => {
    const data = await fetData(`${apiURL}/v1/${artist}/${genre}`);

    // Ajustar as características do texto.
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>'); 
     //replace aqui vai substituir um caracter por outro
     
    songsContainer.innerHTML = `
      <li class="lyrics-container" style="text-align: center;">
        <h2><strong>${genre}</strong> - ${artist}</h2>  
        <p class="lyrics">${lyrics}</p> 
      </li>
    `;
  };