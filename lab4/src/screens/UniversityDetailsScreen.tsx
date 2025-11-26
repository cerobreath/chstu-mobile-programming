// src/screens/UniversityDetailsScreen.tsx
import * as React from 'react';
import {StyleSheet, View, Linking, Platform} from 'react-native';
import {
  Card,
  Chip,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'UniversityDetails'
>;

const UniversityDetailsScreen: React.FC<Props> = ({
                                                    route,
                                                  }) => {
  const {university} = route.params;
  const theme = useTheme();

  const webPages = university.webPages ?? [];
  const domains = university.domains ?? [];

  const openUrl = async (rawUrl: string) => {
    if (!rawUrl) {
      return;
    }
    let url = rawUrl.trim();

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error('openUrl error', url, e);
    }
  };

  const openOnMap = async () => {
    const query = encodeURIComponent(university.name || '');
    if (!query) {
      return;
    }

    const url =
      Platform.OS === 'android'
        ? `geo:0,0?q=${query}`
        : `http://maps.apple.com/?q=${query}`;

    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error('openOnMap error', url, e);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <Card style={styles.card}>
        <Card.Title
          title={university.name}
          subtitle={university.country}
          // показуємо повну назву, не обрізаючи "..."
          titleNumberOfLines={3}
          left={() => (
            <Icon
              name="school"
              size={32}
              color={theme.colors.primary}
            />
          )}
        />
        <Card.Content>
          <List.Section>
            <List.Item
              title="Country"
              description={university.country}
              left={() => (
                <Icon
                  name="map-marker"
                  size={22}
                  style={styles.icon}
                />
              )}
            />
            <List.Item
              title="Alpha-2 code"
              description={university.alphaTwoCode || '-'}
              left={() => (
                <Icon
                  name="alphabetical"
                  size={22}
                  style={styles.icon}
                />
              )}
            />

            <List.Item
              title="Показати на карті"
              description="Відкрити у Google Maps / Apple Maps"
              onPress={openOnMap}
              left={() => (
                <Icon
                  name="map"
                  size={22}
                  style={styles.icon}
                />
              )}
            />
          </List.Section>

          <Text variant="titleSmall" style={styles.sectionTitle}>
            Domains
          </Text>
          <View style={styles.chipRow}>
            {domains.length > 0 ? (
              domains.map(d => (
                <Chip
                  key={d}
                  style={styles.chip}
                  icon="web"
                  onPress={() => openUrl(d)}>
                  {d}
                </Chip>
              ))
            ) : (
              <Text>-</Text>
            )}
          </View>

          <Text variant="titleSmall" style={styles.sectionTitle}>
            Web pages
          </Text>
          <View style={styles.chipRow}>
            {webPages.length > 0 ? (
              webPages.map(url => (
                <Chip
                  key={url}
                  style={styles.chip}
                  icon="link-variant"
                  onPress={() => openUrl(url)}>
                  {url}
                </Chip>
              ))
            ) : (
              <Text>-</Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default UniversityDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 65,
  },
  card: {
    borderRadius: 16,
    marginTop: 8,
  },
  icon: {
    alignSelf: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    marginVertical: 2,
  },
});