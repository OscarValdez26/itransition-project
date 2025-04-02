import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export const db = new sqlite3.Database('./src/database/data.sqlite', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err);
    }
});

export const dbGet = promisify(db.get).bind(db);
export const dbAll = promisify(db.all).bind(db);
export const dbRun = (query, params) => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
    });
});

// db.prepare()	Prepara una consulta para usar varias veces	Usado con .run() y .finalize()
// db.run()	Ejecuta una consulta de escritura (INSERT, UPDATE, DELETE)	Se ejecuta una vez, sin devolver datos
// db.each()	Recorre cada fila encontrada, ejecutando un callback por fila	Eficiente para grandes cantidades de datos
// db.get()	Devuelve solo la primera fila encontrada	Útil si solo esperas un único resultado
// db.all()	Devuelve todas las filas en un array	Mejor si necesitas todos los datos a la vez