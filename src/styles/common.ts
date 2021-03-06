import { StyleSheet } from 'react-native';
import { COPPER_GREY, WHITE } from './colors';
import { FIRA_SANS_BLACK } from './fonts';
import { MARGIN, BORDER_RADIUS, BUTTON_HEIGHT, PADDING } from './metrics';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  disabled: { opacity: 0.6 },
  button: {
    borderRadius: BORDER_RADIUS.MD,
    height: BUTTON_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    ...FIRA_SANS_BLACK.MD,
    textAlign: 'center',
  },
  title: {
    ...FIRA_SANS_BLACK.XL,
    marginHorizontal: MARGIN.XL,
    marginVertical: MARGIN.XL,
    paddingBottom: PADDING.LG,
    color: COPPER_GREY[800],
  },
});
