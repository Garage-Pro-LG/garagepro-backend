const db = require('../config/db');


async function createClientTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id_client TEXT PRIMARY KEY CHECK(LENGTH(id_client) <= 9),   
        name TEXT CHECK(LENGTH(name) <= 45) NOT NULL,                
        surname TEXT CHECK(LENGTH(surname) <= 90) NOT NULL,                   
        email TEXT CHECK(LENGTH(email) <= 100) NOT NULL,    
        phone TEXT CHECK(LENGTH(phone) <= 15),                      
        address TEXT CHECK(LENGTH(address) <= 120),                  
        city TEXT CHECK(LENGTH(city) <= 50),                         
        state TEXT CHECK(LENGTH(state) <= 50),                      
        zip INTEGER,                          
        country TEXT CHECK(LENGTH(country) <= 50),                   
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  async function addClient(id_client, name, surname, email, phone, address, city, state, zip, country) {
    return db.execute(
      `INSERT INTO clients (id_client, name, surname, email, phone, address, city, state, zip, country) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_client, name, surname, email, phone, address, city, state, zip, country]
    );
  }
  
  async function getClients() {
    return db.execute('SELECT * FROM clients');
  }
  
  async function getClientById(id_client) {
    return db.execute('SELECT * FROM clients WHERE id_client = ?', [id_client]);
  }
  
  async function updateClient(id_client, name, surname, email, phone, address, city, state, zip, country) {
    return db.execute(
      `UPDATE clients SET name = ?, surname = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip = ?, country = ?, updated_at = CURRENT_TIMESTAMP WHERE id_client = ?`,
      [name, surname, email, phone, address, city, state, zip, country, id_client]
    );
  }
  
  async function deleteClient(id_client) {
    return db.execute('DELETE FROM clients WHERE id_client = ?', [id_client]);
  }
  
  module.exports = { createClientTable, addClient, getClients, getClientById, updateClient, deleteClient };
  