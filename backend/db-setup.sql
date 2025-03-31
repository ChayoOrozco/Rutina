-- Script para crear la base de datos y tablas necesarias

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS rutina_app;

-- Usar la base de datos
USE rutina_app;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL
);

-- Crear índices
CREATE INDEX idx_username ON users(username);
