import { db } from './db.js';

const createTables = () => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password TEXT NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS Templates (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description TEXT NOT NULL,autor INTEGER NOT NULL,access TEXT NOT NULL,topic TEXT NOT NULL,image TEXT,tags TEXT,admin TEXT ,blocked TEXT,FOREIGN KEY (autor) REFERENCES Users(id))");
        db.run("CREATE TABLE IF NOT EXISTS Questions (id INTEGER PRIMARY KEY AUTOINCREMENT,template INTEGER NOT NULL,title TEXT NOT NULL,description TEXT,question TEXT NOT NULL,type TEXT NOT NULL,position INTEGER NOT NULL,visibility INTEGER NOT NULL,options TEXT,FOREIGN KEY (template) REFERENCES Templates(id) ON DELETE CASCADE);");
        db.run("CREATE TABLE IF NOT EXISTS Answers (id INTEGER PRIMARY KEY AUTOINCREMENT,form INTEGER NOT NULL,question INTEGER NOT NULL,value TEXT NOT NULL,template INTEGER NOT NULL,FOREIGN KEY (form) REFERENCES Forms(id) ON DELETE CASCADE,FOREIGN KEY (question) REFERENCES Questions(id) ON DELETE CASCADE);");
        db.run("CREATE TABLE IF NOT EXISTS Forms (id INTEGER PRIMARY KEY AUTOINCREMENT,template INTEGER NOT NULL,user INTEGER NOT NULL,date DATETIME DEFAULT CURRENT_TIMESTAMP,updatedBy INTEGER DEFAULT NULL,FOREIGN KEY (template) REFERENCES Templates(id) ON DELETE CASCADE,FOREIGN KEY (user) REFERENCES Users(id),FOREIGN KEY (updatedBy) REFERENCES Users(id));");
        db.run("CREATE TABLE IF NOT EXISTS Likes (id INTEGER PRIMARY KEY AUTOINCREMENT,template INTEGER NOT NULL,likes INTEGER DEFAULT 0,dislikes INTEGER DEFAULT 0,FOREIGN KEY (template) REFERENCES Templates(id) ON DELETE CASCADE);");
        db.run("CREATE TABLE IF NOT EXISTS Comments (id INTEGER PRIMARY KEY AUTOINCREMENT,template INTEGER NOT NULL,user INTEGER NOT NULL,comment TEXT NOT NULL,date DATETIME DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (template) REFERENCES Templates(id) ON DELETE CASCADE,FOREIGN KEY (user) REFERENCES Users(id));");
        db.run("CREATE TABLE IF NOT EXISTS Topics (id INTEGER PRIMARY KEY AUTOINCREMENT,topic TEXT NOT NULL UNIQUE);");
        db.run("INSERT INTO Topics (topic) VALUES ('Technology'),('Science'),('Health'),('Education'),('Business'),('Entertainment'),('Sports'),('Politics'),('Environment'),('Travel'),('Food'),('Fashion'),('Music'),('Movies'),('Books'),('Psychology'),('Philosophy'),('History'),('Finance'),('Relationships'),('Parenting'),('Self-Improvement'),('Gaming'),('Marketing'),('Social Media'),('Artificial Intelligence'),('Startups'),('Productivity'),('Mental Health'),('Other');");
        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err.message);
            } else {
                console.log('Base de datos cerrada correctamente.');
            }
        });
    }
    );
}

createTables();