import { StyleSheet } from 'react-native';

export const layout = StyleSheet.create({
  // Базовий екран
  screen: {
    flex: 1,
  },

  // Екран з контентом по центру (без скролу)
  screenCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // Екран зі ScrollView + центрований контент
  scrollScreen: {
    flex: 1,
  },
  scrollContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  // Центровий блок усередині ScrollView
  centerBlock: {
    alignItems: 'center',
  },

  // Позиція перемикача теми (місяць/сонце)
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },

  // Типові відступи для тексту-пояснення
  hintText: {
    marginBottom: 24,
  },

  // Блок з кнопками (по центру, з gap)
  buttonsColumn: {
    alignItems: 'center',
    gap: 12,
  },
});
