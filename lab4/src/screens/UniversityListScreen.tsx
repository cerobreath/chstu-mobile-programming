// src/screens/UniversityListScreen.tsx
import * as React from 'react';
import {useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';
import {
  useUniversitiesViewModel,
} from '../viewmodels/universitiesViewModel';
import type {University} from '../native/UniversitiesNative';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'UniversityList'
>;

const COUNTRY = 'United Kingdom';

const UniversityListScreen: React.FC<Props> = ({navigation}) => {
  const theme = useTheme();
  const [state, reload] = useUniversitiesViewModel(COUNTRY);

  const onPressItem = useCallback(
    (university: University) => {
      navigation.navigate('UniversityDetails', {university});
    },
    [navigation],
  );

  const renderItem = ({item}: {item: University}) => {
    const domains = item.domains?.join(', ') || '-';

    return (
      <List.Item
        title={item.name}
        description={domains}
        onPress={() => onPressItem(item)}
        left={() => (
          <Icon
            name="school"
            size={26}
            color={theme.colors.primary}
            style={styles.leftIcon}
          />
        )}
        right={() => (
          <Icon
            name="chevron-right"
            size={24}
            color={theme.colors.onSurface}
          />
        )}
        style={styles.listItem}
      />
    );
  };

  // Стан "завантаження + немає даних"
  if (state.loading && state.universities.length === 0) {
    return (
      <View
        style={[
          styles.fullCenter,
          {backgroundColor: theme.colors.background},
        ]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Завантаження університетів...
        </Text>
      </View>
    );
  }

  // Стан "помилка + немає даних"
  if (state.error && state.universities.length === 0) {
    return (
      <View
        style={[
          styles.fullCenter,
          {backgroundColor: theme.colors.background},
        ]}>
        <Icon
          name="alert-circle-outline"
          size={40}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>{state.error}</Text>
        <Button
          mode="contained"
          icon="reload"
          onPress={reload}
          style={styles.retryButton}>
          Повторити
        </Button>
      </View>
    );
  }

  // Основний стан: список
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <View style={styles.headerRow}>
        <View>
          <Text variant="titleLarge">Університети UK</Text>
          {state.source && (
            <Text variant="bodySmall" style={styles.sourceText}>
              Джерело даних:{' '}
              {state.source === 'cache'
                ? 'локальний кеш (Room)'
                : 'віддалений API'}
            </Text>
          )}
        </View>
        <Button
          mode="contained"
          icon="reload"
          onPress={reload}
          loading={state.loading}
          compact>
          Оновити
        </Button>
      </View>

      <FlatList
        data={state.universities}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={state.loading}
            onRefresh={reload}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default UniversityListScreen;

const styles = StyleSheet.create({
  fullCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceText: {
    marginTop: 2,
    opacity: 0.7,
  },
  listContent: {
    paddingVertical: 4,
  },
  listItem: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  separator: {
    height: 4,
  },
  leftIcon: {
    marginRight: 12,
    alignSelf: 'center',
  },
});