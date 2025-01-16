//  teste dois para verificar

const searchInputArtista = document.querySelector("#searchInputArtista");
const searchInputMusica = document.querySelector("#searchInputMusica");
const searchInputGenero = document.querySelector("#searchInputGenero");

const fetchData = async (endpoint, queryParam, value) => {
    try {
        //funão do javaS == encodeURIComponent
        const url = `http://localhost:5235/api${endpoint}?${queryParam}=${encodeURIComponent(value)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Um erro ocorreu:", error);
        return null;
    }
};


// DOMContentLoaded == significa que a pag está pronta. 
document.addEventListener("DOMContentLoaded", () => {

    //Artista
    async function searchArtist(artist) {
        try {
            const response = await fetch(`/Getverificarartista?artist=${encodeURIComponent(artist)}`);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
    
            const data = await response.text();
            if (data) {
                const artists = data.split(',');
                const cant = artists.map(a => `<li>${a}</li>`).join('');
                document.getElementById('artistResults').innerHTML = `<ul>${cant}</ul>`;
            } 
        } catch (error) {
            console.error('Erro ao buscar artistas:', error.message);
            document.getElementById('artistResults').innerHTML = "Ocorreu um erro ao buscar artistas.";
        }
    }
    

    //Música
    document.getElementById("submitMusica").addEventListener("click", async (event) => {
        event.preventDefault();
        const input = searchInputMusica.value.trim();

        if (input) {
            const data = await fetchData("/GetMusicas", "musica", input);
            displayResults(data);
        } else {
            alert("Insira uma música válida.");
        }
    });

    //Gênero
    document.getElementById("submitGenero").addEventListener("click", async (event) => {
        event.preventDefault();
        const input = searchInputGenero.value.trim();
        if (input) {
            const data = await fetchData("/GetGenero", "genre", input);
            displayResults(data);
        } else {
            alert("Insira um gênero válido.");
        }
    });

    //mostrar
    function displayResults(data) {
        const container = document.getElementById("songsContainer");
        container.innerHTML = ""; 

        if (data && data.length > 0) {
            data.forEach((item) => {
                const listItem = document.createElement("testes");
                listItem.textContent = JSON.stringify(item); 
                //retorno
                container.appendChild(listItem);
            });
        } else {
            const noResultsMessage = document.createElement("test");
            noResultsMessage.textContent = "Nenhum resultado encontrado.";
            container.appendChild(noResultsMessage);
        }
    }
});
