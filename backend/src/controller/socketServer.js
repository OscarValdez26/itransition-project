import WebSocket,{ WebSocketServer } from 'ws';
import { dbGet, dbAll, dbRun } from '../database/db.js'

const createWSS = (server) => {
    console.log("Iniciando WSS");
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        ws.on('error', console.error);
        ws.on('message', async (message) => {
            const {type, payload } = JSON.parse(message);
            if (type === 'GET_COMMENTS') {
                const data = await getUpdatedComments(payload.template);
                console.log("GETUPDATEDCOMMENTS: ",data);
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
            await dbRun(queryInsertComment);
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
            await dbRun(queryUpdateLikes);
            return "OK";
        } catch (error) {  
            console.error("Error al insertar: ",error);
            return(error);
        }
    }

    const getUpdatedComments = async (template) => {
        const queryGetComments = `SELECT Users.name,comment,strftime('%Y-%m-%d %H:%M:%S', date) AS date FROM Comments INNER JOIN Users ON Users.id = Comments.user WHERE template = ${template} ORDER BY date DESC;`;
            const comments = await dbAll(queryGetComments);
            const likes = await dbAll(`SELECT template,likes,dislikes FROM Likes WHERE template = ${template};`);
            const jsonData = {
                "template":likes[0].template,
                "likes": likes[0].likes,
                "dislikes": likes[0].dislikes,
                "comments": comments
            }
            console.log("JSONDATA: ",jsonData);
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