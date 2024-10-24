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
            response.cookie('token', token, { sameSite: "none", httpOnly: true, secure: true }); //PRODUCCION
            return response.json(user);
        }
        return response.json("Something went wrong");
    } catch (error) {
        response.status(500).json(error);
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
        response.cookie('token', token,{ sameSite: "none", httpOnly: true, secure: true });//, { sameSite: "none", httpOnly: true, secure: true }); PRODUCCION
        return response.json({ "id": user.id, "name": user.name, "email": user.email });
    } catch (error) {
        response.status(500).json(error);
    }
}

export const logoutUser = async (request, response) => {
    try {
        response.cookie('token', " ");
        response.json("Logout OK");
    } catch (error) {
        response.status(500).json(error);
    }
}

export const newTemplate = async (request, response) => {
    try {
        const { title, description, autor, access, topic, image, tags, questions, admin, blocked } = request.body;
        const template = `INSERT INTO Templates (title,description,autor,access,topic,image,tags,admin,blocked) VALUES ("${title}","${description}",${autor},"${access}","${topic}","${image}","${tags}","${admin}","${blocked}");`;
        const result = await pool.query(template);
        const idTemplate = result[0].insertId;
        const values = queryInsertQuestions(questions, idTemplate);
        const another_result = await pool.query(values);
        const setLikes = await pool.query(`INSERT INTO Likes (template,likes,dislikes) VALUES (${idTemplate},0,0);`);
        return response.json("OK");
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getPopularTemplates = async (request, response) => {
    try {
        const [result] = await pool.query(`SELECT Templates.id,title,description,topic,name,COUNT(Forms.template) as count FROM Templates INNER JOIN Users ON Templates.autor = Users.id INNER JOIN Forms ON Forms.template = Templates.id WHERE access LIKE "public" GROUP BY Forms.template ORDER BY count DESC LIMIT 5;`);
        return response.json(result);
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getLatestTemplates = async (request, response) => {
    try {
        const [result] = await pool.query(`SELECT Templates.id,title,description,topic,name FROM Templates INNER JOIN Users ON Templates.autor = Users.id WHERE access LIKE "public" ORDER BY Templates.id DESC LIMIT 5;`);
        return response.json(result);
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getTopics = async (request, response) => {
    try{
        const [result] = await pool.query(`SELECT topic FROM Topics;`);
        response.json(result);
    }catch(error){
        response.status(500).json(error);
    }
}

export const getAllTemplates = async (request, response) => {
    try {
        const { id } = request.body;
        const [result] = await pool.query(`SELECT Templates.id,title,description,topic,image,tags,name,admin,blocked FROM Templates INNER JOIN Users ON Templates.autor = Users.id WHERE access LIKE "public" AND autor != ${id};`);
        return response.json(result);
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getTemplate = async (request, response) => {
    try {
        const { id } = request.body;
        const queryTemplate = `SELECT id,title,description,autor,access,topic,image,tags,admin,blocked FROM Templates WHERE id = ${id};`;
        const queryQuestions = `SELECT id,title,description,question,type,position,visibility,options FROM Questions WHERE template = ${id} ORDER BY position ASC;`;
        const [template] = await pool.query(queryTemplate);
        const [questions] = await pool.query(queryQuestions);
        const jsonData = {
            "id": template[0].id,
            "title": template[0].title,
            "description": template[0].description,
            "autor": template[0].autor,
            "access": template[0].access,
            "topic": template[0].topic,
            "image": template[0].image,
            "tags": template[0].tags,
            "admin": template[0].admin,
            "blocked": template[0].blocked,
            "questions": questions
        };
        return response.json(jsonData);
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const updateTemplate = async (request, response) => {
    try {
        const { id, title, description, access, topic, image, tags, questions, deleted, admin, blocked } = request.body;
        const queryUpdateTemplate = `UPDATE Templates SET title = "${title}", description = "${description}", access = "${access}", topic = "${topic}", image = "${image}", tags = "${tags}", admin = "${admin}",blocked = "${blocked}" WHERE id = ${id}`;
        await pool.query(queryUpdateTemplate);
        const newQuestions = questions.filter(question => !question.id);
        const updated = questions.filter(question => question.id > 0);
        if (newQuestions.length > 0) {
            const queryNewQuestions = queryInsertQuestions(newQuestions, id);
            await pool.query(queryNewQuestions);
        }
        if (updated.length > 0) {
            for (const question of updated){
                const queryUpdateQuestions = `UPDATE Questions SET title = "${question.title}",description = "${question.description}",question = "${question.question}",type = "${question.type}",position = ${question.position},visibility = ${question.visibility},options = "${question.options}" WHERE id = ${question.id}`;
                await pool.query(queryUpdateQuestions);
            }
        }
        if (deleted.length > 0) {
            for (const question of deleted){
                const queryDeleteAnswers = `DELETE FROM Answers WHERE question = ${question.id}`;
                await pool.query(queryDeleteAnswers);
                const queryDeleteQuestions = `DELETE FROM Questions WHERE id = ${question.id}`;
                await pool.query(queryDeleteQuestions);
            }
        }
        return response.json("OK");
    } catch (error) {
        console.error(error);
        return response.status(500).json(error);
    }
}

export const deleteTemplate = async (request, response) => {
    try {
        const { id } = request.body;
        await pool.query(`DELETE FROM Questions WHERE template = ${id}`);
        await pool.query(`DELETE FROM Templates WHERE id = ${id}`);
        return response.json("OK");
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const getUserTemplates = async (request, response) => {
    try {
        const { id } = request.body;
        const [result] = await pool.query(`SELECT id,title,description,autor,access,topic,tags,image,admin,blocked FROM Templates WHERE autor = ${id};`);
        response.json(result);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getUserForms = async (request, response) => {
    try {
        const { id } = request.body; //user.id
        const queryForms = `SELECT DISTINCT Templates.title,Templates.topic,Forms.id,template,DATE_FORMAT(date,"%M %e %Y %T") as date FROM Forms INNER JOIN Answers ON Forms.id = Answers.form INNER JOIN Templates ON Forms.template = Templates.id WHERE Forms.user = ${id};`;
        const [forms] = await pool.query(queryForms);
        const queryAnswers = `SELECT Forms.id,question,value FROM Forms INNER JOIN Answers ON Forms.id = Answers.form INNER JOIN Users ON Forms.user = Users.id WHERE user = ${id};`;
        const [answers] = await pool.query(queryAnswers);
        const jsonForms = forms.map(form => {
            const formAnswers = answers.filter(answer => form.id === answer.id);
            return { ...form, answers: formAnswers };
        });
        console.log(jsonForms);
        response.json(jsonForms);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getForms = async (request, response) => {
    try {
        const { id } = request.body; //template.id
        const queryForms = `SELECT DISTINCT Forms.id,name,template,DATE_FORMAT(date,"%M %e %Y %T") as date FROM Forms INNER JOIN Answers ON Forms.id = Answers.form INNER JOIN Users ON Forms.user = Users.id WHERE template = ${id};`;
        const [forms] = await pool.query(queryForms);
        const queryAnswers = `SELECT Forms.id,question,value FROM Forms INNER JOIN Answers ON Forms.id = Answers.form INNER JOIN Users ON Forms.user = Users.id WHERE template = ${id};`;
        const [answers] = await pool.query(queryAnswers);
        const jsonForms = forms.map(form => {
            const formAnswers = answers.filter(answer => form.id === answer.id);
            return { ...form, answers: formAnswers };
        });
        console.log(jsonForms);
        response.json(jsonForms);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const newForm = async (request, response) => {
    try {
        const { template, user, answers } = request.body;
        const checkExist = `SELECT id FROM Forms WHERE template = ${template} AND user = ${user};`;
        const [exist] = await pool.query(checkExist);
        if(exist.length === 0){
            const insertForm = `INSERT INTO Forms (template,user) VALUES (${template},${user});`;
        const result = await pool.query(insertForm);
        const idForm = result[0].insertId;
        const values = queryInsertAnswers(answers, idForm);
        const another_result = await pool.query(values);
        return response.json("OK");
        }
        return response.json("Form already exist");
    } catch (error) {
        response.status(500).json(error);
    }
}

export const updateForm = async (request, response) => {
    try{
        console.log(request.body);
        const { id, updatedBy, answers, newAnswers } = request.body;
        const queryUpdateForm = `UPDATE Forms SET updatedBy = ${updatedBy} WHERE id = ${id}`;
        let result = await pool.query(queryUpdateForm);
        for (const answer of answers){
            const queryUpdateAnswers = `UPDATE Answers SET value = "${answer.value}" WHERE form = ${answer.id} AND question = ${answer.question}`;
            await pool.query(queryUpdateAnswers);
        }
        for (const answer of newAnswers){
            const queryInsertNewAnswers = `INSERT INTO Answers (form, question, value) VALUES (${id},${answer.question},"${answer.value}");`;
            await pool.query(queryInsertNewAnswers);
        }
        response.json("OK");
    }catch(error){
        console.error(error);
        response.status(500).json(error);
    }
}

export const getAllUsers = async (request, response) => {
    try{
        const [result] = await pool.query(`SELECT id,name,email FROM Users;`);
        response.json(result);
    }catch(error){
        response.status(500).json(error);
    }
}

const queryInsertQuestions = (questions, idTemplate) => {
    let query = "INSERT INTO Questions (template,title,description,question,type,position,visibility,options) VALUES ";
    for (let i = 0; i < questions.length; i++) {
        query += `(${idTemplate},"${questions[i].title}","${questions[i].description}","${questions[i].question}","${questions[i].type}",${questions[i].position},${questions[i].visibility},"${questions[i].options}")`;
        (i === questions.length - 1) ? query += ";" : query += ",";
    }
    return query;
}

const queryInsertAnswers = (answers, idForm) => {
    let query = "INSERT INTO Answers (form,question,value) VALUES ";
    for (let i = 0; i < answers.length; i++) {
        query += `(${idForm},${answers[i].id},"${answers[i].value}")`;
        (i === answers.length - 1) ? query += ";" : query += ",";
    }
    return query;
}

const queryGetTemplate = (id) => {
    return `SELECT id,title,description,autor FROM Templates WHERE id = ${id};`;
}

const queryGetQuestions = (id) => {
    return `SELECT title,description,question,type,position,visibility FROM Questions WHERE template = ${id} ORDER BY position ASC;`;
}

const queryInsertTemplate = (title, description, autor, access) => {
    return `INSERT INTO Templates (title,description,autor,access) VALUES ("${title}","${description}",${autor},"${access}");`;
}

// export const updateTemplate = async (request, response) => {
//     try{
//         const { id,title,description,access,questions,updated,deleted } = request.body;
//         const queryUpdateTemplate = `UPDATE Templates SET title = "${title}", description = "${description}", access = "${access}" WHERE id = ${id}`;
//         await pool.query(queryUpdateTemplate);
//         const newQuestions = questions.filter(question => !question.id);
//         if(newQuestions.length>0){
//             const queryNewQuestions = queryInsertQuestions(newQuestions,id);
//         await pool.query(queryNewQuestions);
//         }      
//         if(updated.length>0){
//             updated.forEach(async (question) => {
//             const queryUpdateQuestions = `UPDATE Questions SET title = "${question.title}",description = "${question.description}",question = "${question.question}",type = "${question.type}",position = ${question.position},visibility = ${question.visibility},options = "${question.options}" WHERE id = ${question.id}`;
//             await pool.query(queryUpdateQuestions);
//         });}
//         if(deleted.length>0){
//             deleted.forEach(async (question) => {
//                 const queryDeleteQuestions = `DELETE FROM Questions WHERE id = ${question.id}`;
//                 await pool.query(queryDeleteQuestions);
//             });
//         }  
//         response.json("OK");
//     }catch(error){
//         response.status(500).json(error);
//     }
// }

export const newRoute = async (request, response) => {
    try{
        const { algo } = request.body;
        response.json("OK");
    }catch(error){
        response.status(500).json(error);
    }
}