// src/screens/GalleryScreen.tsx
import * as React from 'react';
import {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, ActivityIndicator, Button, Card} from 'react-native-paper';
import {RootStackParamList} from '../navigation/RootNavigator';
import {GalleryItem} from '../types/gallery';
import {fetchRemoteGallery} from '../services/gallery';
import {hasInternet, /*isUnmeteredConnection*/} from '../services/network';
import {subscribeGalleryUpdated} from '../services/galleryEvents';
import {
  loadGalleryItems,
  saveGalleryItems,
} from '../services/galleryStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

const GalleryScreen: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!(await hasInternet())) {
        setError('Немає підключення до Інтернету');
        return;
      }

      // const unmetered = await isUnmeteredConnection();
      // if (!unmetered) {
      //   setError(
      //     'Оновлення галереї можливе лише в нетарифікованій мережі (Wi-Fi)',
      //   );
      //   return;
      // }

      const data = await fetchRemoteGallery(30);
      setItems(data);
      await saveGalleryItems(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Error loading gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadGalleryItems();
        if (stored && stored.length > 0) {
          setItems(stored);
        } else {
          await loadGallery();
        }
      } catch (e) {
        console.error('Initial gallery load error', e);
        await loadGallery();
      }
    })();
  }, [loadGallery]);

  useEffect(() => {
    const unsubscribe = subscribeGalleryUpdated(() => loadGallery());
    return unsubscribe;
  }, [loadGallery]);

  const renderItem = ({item}: {item: GalleryItem}) => {
    const thumbUrl = `https://picsum.photos/id/${item.id}/400/400`;

    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => navigation.navigate('Photo', {item})}>
        <Image source={{uri: thumbUrl}} style={styles.thumb} />
      </TouchableOpacity>
    );
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <Card
          mode="elevated"
          style={styles.vanillaCard}
          theme={{
            colors: {
              surface: '#ffffff',
              onSurface: '#000000',
              surfaceVariant: '#ffffff',
              onSurfaceVariant: '#000000',
            },
          }}>
          <Card.Content style={styles.cardContent}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Завантаження галереї...</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  // Немає інтернету або тільки мобільний інтернет
  if (error && items.length === 0) {
    return (
      <View style={styles.center}>
        <Card
          mode="elevated"
          style={styles.vanillaCard}
          theme={{
            colors: {
              surface: '#ffffff',
              onSurface: '#000000',
              surfaceVariant: '#ffffff',
              onSurfaceVariant: '#000000',
            },
          }}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.errorTitle}>
              Помилка
            </Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button
              mode="contained"
              onPress={loadGallery}
              style={styles.retryButton}>
              Спробувати ще раз
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.refreshButton}
        onPress={loadGallery}
        loading={loading}>
        Оновити галерею
      </Button>

      {error && (
        <Text style={styles.statusText}>{error}</Text>
      )}

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  vanillaCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 24,
    fontSize: 18,
    color: '#000000',
  },
  errorTitle: {
    color: '#000000',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  retryButton: {
    alignSelf: 'center',
  },
  refreshButton: {marginBottom: 8},
  listContent: {paddingBottom: 16},
  row: {
    justifyContent: 'space-between',
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
  thumb: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  statusText: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#d32f2f',
    fontSize: 14,
  },
});

export default GalleryScreen;