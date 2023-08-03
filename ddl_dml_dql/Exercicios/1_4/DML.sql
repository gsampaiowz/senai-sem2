 USE Exercicio_1_4;

INSERT INTO Artistas
	(Nome)
VALUES
	('Goku'),
	('Vegeta'),
	('Vidal');

INSERT INTO Permissao
	(Tipo)
VALUES
	('Adm'),
	('Comum');

INSERT INTO Estilos
	(Nome)
VALUES
	('Trap'),
	('Rock'),
	('Pop');

INSERT INTO Ativo
	(Resposta)
VALUES
	('SIM'),
	('NAO');

INSERT INTO Usuarios
	(IdPermissao, Nome, Email, Senha)
VALUES
	(1, 'Galvao', 'galvao@email.com', '123'),
	(2, 'Messi', 'meci@email.com', '123'),
	(2, 'Cr7', 'cris@email.com', '123');

INSERT INTO Albuns
	(IdArtista, IdAtivo, Titulo, DataLancamento, Localizacao, QtdMinutos)
VALUES
	(1, 1 ,'Happier Than Ever','20/02/2021','EUA','25'),
	(2, 2 ,'Vampiro','25/05/2022','BRAZIL','21');

INSERT INTO AlbunsEstilos
	(IdAlbum, IdEstilo)
VALUES
	(2,3),
	(3,1);

SELECT * FROM Albuns;
SELECT * FROM AlbunsEstilos;
SELECT * FROM Artistas;
SELECT * FROM Ativo;
SELECT * FROM Estilos;
SELECT * FROM Permissao;
SELECT * FROM Usuarios;