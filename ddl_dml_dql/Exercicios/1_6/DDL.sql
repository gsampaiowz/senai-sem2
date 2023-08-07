CREATE DATABASE Exercicio_1_6;

USE Exercicio_1_6;

CREATE TABLE Colaboradores 
(
	IdColaborador INT PRIMARY KEY IDENTITY,
	Nome VARCHAR(64) NOT NULL,
	Salario FLOAT NOT NULL
);

CREATE TABLE Clientes
(
	IdCliente INT PRIMARY KEY IDENTITY,
	Nome VARCHAR(64) NOT NULL,
);

CREATE TABLE Itens
(
	IdItem INT PRIMARY KEY IDENTITY,
	Descricao VARCHAR(32) NOT NULL,
);

CREATE TABLE TiposConsertos
(
	IdTipoConserto INT PRIMARY KEY IDENTITY,
	Descricao VARCHAR(64) NOT NULL,
);

CREATE TABLE Pedidos
(
	IdPedido INT PRIMARY KEY IDENTITY,
	IdCliente INT FOREIGN KEY REFERENCES Clientes(IdCliente) NOT NULL UNIQUE,
	IdTipoConserto INT FOREIGN KEY REFERENCES TiposConsertos(IdTipoConserto) NOT NULL UNIQUE,
	IdItem INT FOREIGN KEY REFERENCES Itens(IdItem) NOT NULL UNIQUE,
	Nome VARCHAR(32) NOT NULL,
);

CREATE TABLE PedidosColaboradores
(
	IdPedidosColaboradores INT PRIMARY KEY IDENTITY,
	IdPedido INT FOREIGN KEY REFERENCES Pedidos(IdPedido) NOT NULL,
	IdColaborador INT FOREIGN KEY REFERENCES Colaboradores(IdColaborador) NOT NULL,
)
