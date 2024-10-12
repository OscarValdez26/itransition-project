import { pool } from '../database/db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const registerUser = async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const [user] = await pool.query(`SELECT * FROM Users WHERE email = "${email}"`);
        if (user.length > 0) return response.json("User already exist");
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(`INSERT INTO Users (name,email,password) VALUES ("${name}","${email}","${hash}");`);
        if (result[0].insertId > 1) {
            const token = jwt.sign({ email: email }, process.env.SECRET_KEY);
            const [userFound] = await pool.query(`SELECT id,name,email FROM Users WHERE id = ${result[0].insertId}`);
            const user = userFound[0];
            response.cookie('token', token); //, { sameSite: "none", httpOnly: true, secure: true }); PRODUCCION
            return response.json(user);
        }
        return response.json("Something went wrong");
    } catch (error) {
        response.status(500).json(error);
        //DELETE FROM table WHERE id>0;
        //ALTER TABLE table AUTO_INCREMENT = 1;
    }
}

export const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;
        const [userFound] = await pool.query(`SELECT id,name,email,password FROM Users WHERE email = "${email}"`);
        const user = userFound[0];
        if (userFound.length === 0) return response.json("User not found");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return response.json("Password invalid");
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
        response.cookie('token', token);//, { sameSite: "none", httpOnly: true, secure: true }); PRODUCCION
        return response.json({"id":user.id,"name":user.name,"email":user.email});
    } catch (error) {
        response.status(500).json(error);
    }
}

export const logoutUser = async (request,response) => {
    try{
        response.cookie('token'," ");
        response.json("Logout OK");
    }catch(error){
        response.status(500).json(error);
    }
}

export const newTemplate = async (request,response) => {
    try{
        const { title, description, autor, access, questions } = request.body;
        const template = `INSERT INTO Templates (title,description,autor,access) VALUES ("${title}","${description}",${autor},"${access}");`;
        const result = await pool.query(template);
        const idTemplate = result[0].insertId;
        const values = queryInsertQuestions(questions,idTemplate);
        console.log(template);
        console.log(values);
        const another_result = await pool.query(values);
        return response.json("OK");
    }catch(error){
        response.status(500).json(error);
    }
}

export const getAllTemplates = async (request,response) => {
    try{
        const [result] = await pool.query(`SELECT id,title,description,autor FROM Templates WHERE access LIKE "public";`);
        return response.json(result);
    }catch(error){
        response.status(500).json(error);
    }
}

export const getTemplate = async (request,response) => {
    try{
        const { id } = request.body;
        const queryTemplate = `SELECT id,title,description,autor,access FROM Templates WHERE id = ${id};`;
        const queryQuestions = `SELECT title,description,question,type,position,visibility,options FROM Questions WHERE template = ${id} ORDER BY position ASC;`;
        const [template] = await pool.query(queryTemplate);
        console.log(template);
        const [questions] = await pool.query(queryQuestions);
        const jsonData = {
            "id":template[0].id,
            "title":template[0].title,
            "description":template[0].description,
            "autor":template[0].autor,
            "access":template[0].access,
            "questions": questions};
            console.log(jsonData);
        response.json(jsonData);
    }catch(error){
        response.status(500).json(error);
    }
}

export const getUserTemplates = async (request,response) => {
    try{
        const { id } = request.body;
        const [result] = await pool.query(`SELECT id,title,description,autor,access FROM Templates WHERE autor = ${id};`);
        response.json(result);
    }catch(error){
        response.status(500).json(error);
    }
}

export const getPopularTemplates = async (request, response) => {
    try {
        return response.json("OK");
    } catch (error) {
        return response.status(500).json(error);
    }
}

const queryInsertQuestions = (questions,idTemplate) => {
    let query = "INSERT INTO Questions (template,title,description,question,type,position,visibility,options) VALUES ";
        for (let i=0;i<questions.length;i++){
            query += `(${idTemplate},"${questions[i].title}","${questions[i].description}","${questions[i].question}","${questions[i].type}",${questions[i].position},"${questions[i].visibility}","${questions[i].options}")`;
            (i === questions.length-1) ? query += ";" : query += ",";
        }
        return query;
}

const queryGetTemplate = (id) => {
    return `SELECT id,title,description,autor FROM Templates WHERE id = ${id};`;
}

const queryGetQuestions = (id) => {
    return `SELECT title,description,question,type,position,visibility FROM Questions WHERE template = ${id} ORDER BY position ASC;`;
}

const queryInsertTemplate = (title,description,autor,access) => {
    return `INSERT INTO Templates (title,description,autor,access) VALUES ("${title}","${description}",${autor},"${access}");`;
}