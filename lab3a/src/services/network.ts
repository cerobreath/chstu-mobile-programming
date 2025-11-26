// src/services/network.ts
import NetInfo from '@react-native-community/netinfo';

export async function getNetworkStatus() {
  const state = await NetInfo.fetch();
  const details = state.details as any;
  const isExpensive = details?.isConnectionExpensive;

  const isConnected =
    !!state.isConnected && !!state.isInternetReachable;

  // Нетарифікована: Wi-Fi і НЕ позначений як дорогий
  const isUnmetered =
    state.type === 'wifi' && isExpensive !== true;

  return {state, isConnected, isUnmetered};
}

export async function hasInternet(): Promise<boolean> {
  const {isConnected} = await getNetworkStatus();
  return isConnected;
}

export async function isUnmeteredConnection(): Promise<boolean> {
  const {isConnected, isUnmetered} = await getNetworkStatus();
  return isConnected && isUnmetered;
}
