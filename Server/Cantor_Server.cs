using System.Text.Json;
using System.Text.Json.Serialization;
using MinhaPaginaWeb.Models;

namespace MinhaPaginaWeb.Server;
    public class Cantor_Server
    {

        private readonly HttpClient _httpClient;

        public Cantor_Server(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<CantorViewModel>> GetCantoresAsync()
        {
            try
            {
                var url = "https://guilhermeonrails.github.io/api-csharp-songs/songs.json";
                var response = await _httpClient.GetStringAsync(url);
                var cantor = JsonSerializer.Deserialize<List<CantorViewModel>>(response);
                // "??" para não retornar null            
                return cantor ?? new List<CantorViewModel>();
            }
            catch (Exception error)
            {
                Console.WriteLine($"Erro ao localizar: {error.Message}");
                return new List<CantorViewModel>(); 
            }
        }
    }

