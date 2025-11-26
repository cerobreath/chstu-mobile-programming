// src/screens/PhotoScreen.tsx
import * as React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, ProgressBar, Text } from 'react-native-paper';
import { RootStackParamList } from '../navigation/RootNavigator';
import { downloadImage } from '../services/gallery';

type Props = NativeStackScreenProps<RootStackParamList, 'Photo'>;

const PhotoScreen: React.FC<Props> = ({ route }) => {
  const { item } = route.params;

  const [localPath, setLocalPath] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const remoteUrl = `https://picsum.photos/id/${item.id}/800/600`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setProgress(0);
      const path = await downloadImage(item, pct => setProgress(pct));
      setLocalPath(path);
    } catch (e) {
      console.error('Download error', e);
    } finally {
      setDownloading(false);
    }
  };

  const imageSource = localPath
    ? localPath.startsWith('content://') ||
    localPath.startsWith('ph://')
      ? { uri: localPath }
      : { uri: 'file://' + localPath }
    : { uri: remoteUrl };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card
        mode="elevated"
        style={styles.card}
        theme={{
          colors: {
            surface: '#ffffff',
            onSurface: '#000000',
            surfaceVariant: '#ffffff',
            onSurfaceVariant: '#000000',
          },
        }}
      >
        <Card.Title
          title={`Photo ${item.id}`}
          subtitle={item.author}
          titleStyle={styles.titleText}
          subtitleStyle={styles.subtitleText}
        />
        <Card.Content>
          <Image source={imageSource} style={styles.image} />

          <Text style={styles.infoText}>
            Розміри оригіналу: {item.width}×{item.height}
          </Text>

          <Button
            mode="contained"
            style={styles.button}
            onPress={handleDownload}
            loading={downloading}
          >
            Завантажити фото локально
          </Button>

          {(downloading || progress > 0) && (
            <View style={styles.progressBlock}>
              <Text style={styles.progressText}>
                Прогрес завантаження: {Math.round(progress * 100)}%
              </Text>
              <ProgressBar
                progress={progress}
                style={styles.progressBar}
                color="#6200ee"
              />
            </View>
          )}

          {localPath && (
            <Text style={styles.pathText} selectable>
              Локальний шлях: {localPath}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  titleText: { color: '#000000', fontWeight: 'bold' },
  subtitleText: { color: '#000000' },
  infoText: { marginTop: 8, color: '#000000' },
  button: { marginTop: 12 },
  progressBlock: { marginTop: 8 },
  progressText: { color: '#000000' },
  progressBar: { height: 6, borderRadius: 3, marginTop: 4 },
  pathText: { marginTop: 8, fontSize: 12, color: '#000000' },
});

export default PhotoScreen;
