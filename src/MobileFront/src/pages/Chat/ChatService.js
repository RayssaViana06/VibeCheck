import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import * as SecureStore from 'expo-secure-store';

export const CHAT_HUB_URL = 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/message/hub';

function buildChatHubUrl(token) {
  const url = new URL(CHAT_HUB_URL);
  if (token) url.searchParams.set('token', token);
  return url.toString();
}

export async function getChatToken() {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token || '';
  } catch (e) {
    return '';
  }
}

export function createChatConnection(token) {
  if (!token) throw new Error('Token não informado para a conexão do chat.');

  return new HubConnectionBuilder()
    .withUrl(buildChatHubUrl(token), {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
}

export async function startChatConnection(connection, onReceiveMessage) {
  if (onReceiveMessage) connection.on('ReceiveMessage', onReceiveMessage);
  await connection.start();
  return connection;
}

export async function sendChatMessage(connection, payload) {
  return connection.invoke('SendMessage', payload);
}

export async function stopChatConnection(connection) {
  if (!connection) return;
  try {
    connection.off('ReceiveMessage');
    await connection.stop();
  } catch (e) {
    // ignore
  }
}

export async function getUserFromStorage() {
  try {
    const userJson = await SecureStore.getItemAsync('user');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}
