import {WebSocket, WebSocketServer} from "ws";

const wss = new WebSocketServer({port: 8080});
wss.on("connection", (ws) => {
	console.log("a new connection happened");

	ws.on("message", (receivedMessage) => {
		console.log("this is the received message: ", receivedMessage.toString());
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(receivedMessage.toString());
			}
		});
	});
	ws.on("close", () => {
		console.log("client disconneceted ");
	});
	ws.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
});
