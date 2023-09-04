using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

//Adiciona o servi�o de controllers
builder.Services.AddControllers();

//Adiciona servi�o de autentica��o JWT Bearer
builder.Services.AddAuthentication(options =>
{
	options.DefaultChallengeScheme = "JwtBearer";
	options.DefaultAuthenticateScheme = "JwtBearer";
})

//Define os par�metros de valida��o do token
.AddJwtBearer("JwtBearer", options =>
 {
	 options.TokenValidationParameters = new TokenValidationParameters
		 {
		 //VALIDA��ES DO TOKEN
		 //Quem est� solicitando
		 ValidateIssuer = true,
		 //Quem est� recebendo
		 ValidateAudience = true,
		 //Define se o tempo de expira��o do token ser� validado
		 ValidateLifetime = true,
		 //Forma de criptografia e ainda valida��o da chave de autentica��o
		 IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("filmes-chave-autenticacao-webapi-dev")),
		 //Tempo de expira��o do token
		 ClockSkew = TimeSpan.FromMinutes(30),
		 //Nome da issuer, de onde est� vindo
		 ValidIssuer = "webapi.filmes.tarde",
		 //Nome da audience, de onde est� vindo
		 ValidAudience = "webapi.filmes.tarde"
		 };
 });

//Adiciona o gerador do Swagger � cole��o de servi�os no Program.cs
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
		{
		Version = "v1",
		Title = "API Filmes Tarde",
		Description = "API para Gerenciamento de filmes - Introdu��o a sprint 2 - BackEndAPI",
		Contact = new OpenApiContact
			{
			Name = "Sampaio",
			Url = new Uri("https://github.com/gsampaiowz")
			},
		});
	//Configura o Swagger para usar o arquivo XML gerado com as instru��es anteriores
	var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

	//Usando a autentica��o via JWT no swagger
	options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
		{
		Name = "Authorization",
		Type = SecuritySchemeType.ApiKey,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = ParameterLocation.Header,
		Description = "Value: Bearer TokenJWT"
		});

	options.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
				{
					Reference = new OpenApiReference
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer",
						}
				},
			Array.Empty<string>()
		}
	});
});

var app = builder.Build();

//Habilita o middleware para atender ao documento JSON gerado e � interface do usu�rio do Swagger
//adicionar� o middleware do Swagger somente se o ambiente atual estiver definido como Desenvolvimento. A chamada do m�todo UseSwaggerUI habilita o Middleware de arquivos est�ticos.
if (app.Environment.IsDevelopment())
	{
	app.UseSwagger();
	app.UseSwaggerUI();
	}

//Para atender � interface do usu�rio do Swagger na raiz do aplicativo (https://localhost:<port>/), define-se a propriedade RoutePrefix como uma cadeia de caracteres vazia:
app.UseSwaggerUI(options =>
{
	options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
	options.RoutePrefix = string.Empty;
});

app.UseAuthentication();

app.UseAuthorization();

//Mapear os controllers
app.MapControllers();

app.Run();
