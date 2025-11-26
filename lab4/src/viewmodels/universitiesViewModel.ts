import NetInfo from '@react-native-community/netinfo';
import {Platform, ToastAndroid} from 'react-native';
import UniversitiesModule, {University} from '../native/UniversitiesNative';
import React from 'react';

type ViewState = {
  loading: boolean;
  error: string | null;
  universities: University[];
  source: 'remote' | 'cache' | null;
};

function showToast(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    console.log('[Toast]', msg);
  }
}

export function useUniversitiesViewModel(
  country: string,
): [ViewState, () => void] {
  const [state, setState] = React.useState<ViewState>({
    loading: false,
    error: null,
    universities: [],
    source: null,
  });

  const load = React.useCallback(async () => {
    try {
      setState(prev => ({...prev, loading: true, error: null}));

      const netState = await NetInfo.fetch();
      const isConnected =
        !!netState.isConnected && !!netState.isInternetReachable;

      const res = await UniversitiesModule.loadUniversities(country);

      setState({
        loading: false,
        error: null,
        universities: res.items,
        source: res.source,
      });

      if (res.source === 'cache') {
        if (!isConnected) {
          showToast(
            'Інтернет недоступний, дані завантажено з локальної бази',
          );
        } else {
          showToast(
            'Дані завантажено з локальної бази (помилка віддаленого сервісу)',
          );
        }
      }
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e?.message ?? 'Error loading universities',
      }));
    }
  }, [country]);

  React.useEffect(() => {
    load();
  }, [load]);

  return [state, load];
}