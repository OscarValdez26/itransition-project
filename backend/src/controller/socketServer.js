import WebSocket,{ WebSocketServer } from 'ws';
import { pool } from '../database/db.js'

const createWSS = (server) => {
    console.log("Iniciando WSS");
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('error', console.error);
        ws.on('message', async (message) => {
            const {type, payload } = JSON.parse(message);
            if (type === 'GET_COMMENTS') {
                const data = await getUpdatedComments(payload.template);
                ws.send(JSON.stringify(data));
            }
            else if (type === 'ADD_COMMENT') {
                const result = await insertComments(payload);
                const data = await getUpdatedComments(payload.template);
                broadcast(data);
            }
            else if (type === 'ADD_LIKES') {
                const result = await insertLikes(payload);
                const data = await getUpdatedComments(payload.template);
                broadcast(data);
            }
        });
    });

    const insertComments = async (payload) => {
        try {
            const { template, user, comment } = payload;
            const queryInsertComment = `INSERT INTO Comments (template, user, comment) VALUES (${template},${user},'${comment}');`;
            const [result] = await pool.query(queryInsertComment);
            return "OK";
        } catch (error) {  
            console.error("Error al insertar: ",error);
            return(error);
        }
    }

    const insertLikes = async (payload) => {
        try {
            const { template, likes, dislikes } = payload;
            const queryUpdateLikes = `UPDATE Likes SET likes = ${likes}, dislikes = ${dislikes} WHERE template = ${template};`;
            const [result] = await pool.query(queryUpdateLikes);
            return "OK";
        } catch (error) {  
            console.error("Error al insertar: ",error);
            return(error);
        }
    }

    const getUpdatedComments = async (template) => {
        const queryGetComments = `SELECT Users.name,comment,DATE_FORMAT(date,"%d/%m/%Y %H:%i:%s") as date FROM Comments INNER JOIN Users ON Users.id = Comments.user WHERE template = ${template} ORDER BY date DESC;`;
            const [comments] = await pool.query(queryGetComments);
            const [likes] = await pool.query(`SELECT template,likes,dislikes FROM Likes WHERE template = ${template};`);
            const jsonData = {
                "template":likes[0].template,
                "likes": likes[0].likes,
                "dislikes": likes[0].dislikes,
                "comments": comments
            }
            return jsonData;
    }

    function broadcast(data) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

export default createWSS;