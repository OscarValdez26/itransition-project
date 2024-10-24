import app from "./app.js";
import http from 'http'
import createWSS from "./controller/socketServer.js";
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
createWSS(server);
server.listen(PORT);
console.log("Server listen on port: ", PORT);