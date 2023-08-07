CREATE DATABASE Exercicio_1_4;

USE Exercicio_1_4;

CREATE TABLE Artistas
(
	IdArtista INT PRIMARY KEY IDENTITY,
	Nome VARCHAR(32) NOT NULL,
);

CREATE TABLE Permissao
(
	IdPermissao INT PRIMARY KEY IDENTITY,
	Tipo VARCHAR(32) NOT NULL UNIQUE,
);

CREATE TABLE Usuarios(
	IdUsuario INT PRIMARY KEY IDENTITY,
	IdPermissao INT FOREIGN KEY REFERENCES Permissao(IdPermissao),
	Nome VARCHAR(32) NOT NULL,
	Email VARCHAR(256) NOT NULL UNIQUE,
	Senha VARCHAR(32) NOT NULL,
);

CREATE TABLE Estilos
(
	IdEstilo INT PRIMARY KEY IDENTITY,
	Nome VARCHAR(32) NOT NULL,
);

CREATE TABLE Ativo
(
	IdAtivo INT PRIMARY KEY IDENTITY,
	Resposta VARCHAR(3) NOT NULL UNIQUE,
);

CREATE TABLE Albuns
(
	IdAlbum INT PRIMARY KEY IDENTITY,
	IdArtista INT FOREIGN KEY REFERENCES Artistas(IdArtista) NOT NULL UNIQUE,
	IdAtivo INT FOREIGN KEY REFERENCES Ativo(IdAtivo) NOT NULL UNIQUE,
	Titulo VARCHAR(64) NOT NULL,
	AnoLancamento INT NOT NULL,
	Localizacao VARCHAR(64) NOT NULL,
	QtdMinutos INT NOT NULL,
);

CREATE TABLE AlbunsEstilos
(
	IdAlbumEstilo INT PRIMARY KEY IDENTITY,
	IdAlbum INT FOREIGN KEY REFERENCES Albuns(IdAlbum) NOT NULL,
	IdEstilo INT FOREIGN KEY REFERENCES Estilos(IdEstilo) NOT NULL,
);