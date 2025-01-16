using MinhaPaginaWeb.Controllers;
using MinhaPaginaWeb.Server;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

//cors
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

builder.Services.AddHttpClient<Cantor_Server>(client =>
{
    client.BaseAddress = new Uri("https://guilhermeonrails.github.io/");
});

builder.Services.AddHttpClient<Cantor_Server>();
builder.Services.AddHttpClient<CantorController>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

//para aparecer o css naa tela DUDAAAAAAAAAAAA.
app.UseStaticFiles();

// app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Artista}/{id?}");

app.Run();
