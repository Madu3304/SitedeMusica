using MinhaPaginaWeb.Server;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace MinhaPaginaWeb.Controllers
{
    [ApiController]
    [Route("api:[controller]")]
    public class CantorController : ControllerBase
    {
        
        //injeção 
        private readonly Cantor_Server _cantor_Server; 
        private readonly ILogger<CantorController> _logger;
 
         public CantorController(Cantor_Server cantor_Server, ILogger<CantorController> logger)
        {
            _cantor_Server = cantor_Server;
            _logger = logger;
        }



            //##################################
            //cantor - musica
            [HttpGet]
            public async Task<IActionResult> GetFiltroCantores(string? musica = null)
            {
                var cantores = await _cantor_Server.GetCantoresAsync();

                var filtros = new { Musica = musica?.ToLower() };

                var Filtrados = cantores.Where(c =>
                    (filtros.Musica == null || c.Song?.ToLower().Contains(filtros.Musica) == true));

                var resultado = Filtrados.Select(m =>
                    $"Artista: {m.Artist}, Música: {m.Song}, Gênero: {m.Genre}, Música: {m.Song}")
                    .ToList();

                return Ok(resultado);
            }

            //mostrar todos os generos
            [HttpGet("GetTodosGeneros")]
            public async Task<IActionResult> GetGeneros()
            {
                var arti = await _cantor_Server.GetCantoresAsync();
                var gene = arti.Select(c => c.Genre?.ToLower()).Where(gene => !string.IsNullOrEmpty(gene)).Distinct().ToList();

                return Ok(gene);
            }


            //##################################
            //genero
            [HttpGet("GetGenero")]
            public async Task<IActionResult> GetFiltroGenero(string? genero = null)
            {
                var cantores = await _cantor_Server.GetCantoresAsync();
                var filtros = new { Genero = genero?.ToLower() };
                var Filtrados = cantores.Where(c => (filtros.Genero == null || c.Genre?.ToLower().Contains(filtros.Genero) == true))
                    .ToList();

                var resultado = Filtrados.Select(m => $"Artista: {m.Artist}").ToList();
                // '?' tem o mesmo sentido aqui 
                return Ok(resultado);
            }



            //##################################
            //cantor ordenado
            [HttpGet("Getartistaordenado")]
            public async Task<IActionResult> GetCantoresOrdenados()
            {
                try
                {
                    var cantores = await _cantor_Server.GetCantoresAsync();
                    var cantoresOrdenados = cantores.OrderBy(c => c.Artist).ToList();
                    var nomesConcatenados = string.Join(", ", cantoresOrdenados.Select(c => c.Artist));

                    return Ok(nomesConcatenados);
                }
                catch (JsonException)
                { return StatusCode(500, "Erro ao  ordenar."); }
            }


            //Newtonsoft.Json == C#
            //IActionResult == resposta http


            //##################################
            //cantor
            [HttpGet("Getverificarartista")]
            public async Task<IActionResult> GetFiltroPorNome(string artist)
            {
                try
                {
                    var cantores = await _cantor_Server.GetCantoresAsync();
                    var cantoresFiltrados = cantores.Where(c =>!string.IsNullOrEmpty(c.Artist) && c.Artist.Contains(artist ?? string.Empty, StringComparison.OrdinalIgnoreCase));
                    var nomesConcatenados = string.Join(",", cantoresFiltrados.Select(c => c.Artist ?? string.Empty));

                    //aqui vai mostrar as musicas do cantor
                    var cantoresFil = cantores.Where(c => c.Song == null || c.Song.ToLower().Contains(c.Song ?? string.Empty));
                    var resultado = cantoresFiltrados.Select(m => $"Música: {m.Song} ??").ToList();

                    return Ok(resultado);
                }
                catch (JsonException)
                { return StatusCode(500, "Artista não localizado."); }
            }
    }
}