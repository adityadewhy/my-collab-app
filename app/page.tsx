"use client";
import {useEffect, useState, useRef} from "react";

const this_key_saves_text = "keyToSaveText";

export default function Home() {
	const [text, setText] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);

	const ws = useRef<WebSocket | null>(null);
	useEffect(() => {
		const savedText = localStorage.getItem(this_key_saves_text);
		if (savedText) {
			setText(savedText);
		}
		setIsLoaded(true);

		const socket = new WebSocket("ws://localhost:8080");
		socket.onopen = () => {
			console.log("ws onOpen enteredu");
		};
		socket.onmessage = (event) => {
			const receivedMessage = event.data;
			console.log(
				"on message entered, event is: ",
				event,
				"event.data is : ",
				receivedMessage
			);
			setText(receivedMessage);
		};

		socket.onclose = () => {
			console.log("ws disconnected");
		};

		ws.current = socket;
		console.log("socket is same as ws.current: ", socket);

		return () => {
			socket.close();
		};
	}, []);

	const socket = new WebSocket("ws://localhost:8080");
	socket.onopen = () => {
		console.log("ws onOpen enteredu");
	};
	socket.onmessage = (event) => {
		const receivedMessage = event.data;
		console.log(
			"on message entered, event is: ",
			event,
			"event.data is : ",
			receivedMessage
		);
		setText(receivedMessage);
	};

	socket.onclose = () => {
		console.log("ws disconnected");
	};

	useEffect(() => {
		if (!isLoaded) {
			return;
		}
		localStorage.setItem(this_key_saves_text, text);
	}, [text, isLoaded]);

	const handleChange = (e: any) => {
		setText(e.target.value);
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(e.target.value);
		}
	};

	return (
		<div>
			<p>trying out localStorage storage settings</p>
			<textarea placeholder="type here" value={text} onChange={handleChange} />
		</div>
	);
}
