-- listar todos os usu�rios administradores, sem exibir suas senhas
-- listar todos os �lbuns lan�ados ap�s o um determinado ano de lan�amento
-- listar os dados de um usu�rio atrav�s do e-mail e senha
-- listar todos os �lbuns ativos, mostrando o nome do artista e os estilos do �lbum 

SELECT 
	Nome, Email, IdPermissao
FROM	
	Usuarios

SELECT
	*
FROM
	Albuns
WHERE
	AnoLancamento > 2020

SELECT
	*
FROM
	Usuarios
WHERE
	Email = 'meci@email.com'
	AND Senha = 123

SELECT	
	Artistas.Nome AS Artista,
	AlbunsEstilos.IdEstilo,
	Albuns.Titulo AS Titulo
FROM Albuns
	JOIN AlbunsEstilos on Albuns.IdAlbum = AlbunsEstilos.IdAlbum
	JOIN Artistas on Albuns.IdArtista = Artistas.IdArtista
WHERE
	Albuns.IdAtivo = 1

	