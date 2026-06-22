import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export const CHAT_HUB_URL = 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/message/hub';

function buildChatHubUrl(token) {
	const url = new URL(CHAT_HUB_URL);

	if (token) {
		url.searchParams.set('token', token);
	}

	return url.toString();
}

export function getChatToken() {
	if (typeof window === 'undefined') {
		return '';
	}

	const params = new URLSearchParams(window.location.search);
	return params.get('token') || params.get('access_token') || localStorage.getItem('token') || '';
}

export function createChatConnection(token) {
	if (!token) {
		throw new Error('Token não informado para a conexão do chat.');
	}

	return new HubConnectionBuilder()
		.withUrl(buildChatHubUrl(token), {
			accessTokenFactory: () => token,
		})
		.withAutomaticReconnect()
		.configureLogging(LogLevel.Information)
		.build();
}

export async function startChatConnection(connection, onReceiveMessage) {
	if (onReceiveMessage) {
		connection.on('ReceiveMessage', onReceiveMessage);
	}

	await connection.start();
	return connection;
}

export async function sendChatMessage(connection, payload) {
	return connection.invoke('SendMessage', payload);
}

export async function stopChatConnection(connection) {
	if (!connection) {
		return;
	}

	connection.off('ReceiveMessage');
	await connection.stop();
}

export function getUserFromStorage() {
	if (typeof window === 'undefined') {
		return null;
	}

	const userJson = localStorage.getItem('user');
	if (!userJson) return null;

	try {
		return JSON.parse(userJson);
	} catch (e) {
		return null;
	}
}
