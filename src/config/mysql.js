
import mysql from 'mysql2/promise';
import IDatabase from '../interfaces/IDatabase.js';
import dotenv from 'dotenv';

dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'annonces_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class MySQLDatabase extends IDatabase {
    async create(table, data) {
        const [result] = await pool.query(`INSERT INTO ${table} SET ?`, data);
        return result.insertId;
    }

    async findById(table, id) {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
        return rows[0];
    }

    async findAll(table) {
        const [rows] = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    }

    async update(table, id, data) {
        const [result] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
        return result.affectedRows;
    }

    async delete(table, id) {
        const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        return result.affectedRows;
    }
    async findByField(table, field, value) {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
        return rows[0];
    }
    async findAllByField(table, field, value) {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${field} =?`, [value]);
        return rows;
    }
}
export default MySQLDatabase
