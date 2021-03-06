import { StyleSheet } from 'react-native';
import { COPPER, COPPER_GREY, WHITE } from '../../styles/colors';
import { FIRA_SANS_MEDIUM, FIRA_SANS_REGULAR } from '../../styles/fonts';
import { BORDER_RADIUS, MARGIN, PADDING, AVATAR_SIZE, BORDER_WIDTH } from '../../styles/metrics';

export default StyleSheet.create({
  personCellEditable: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: PADDING.LG,
    marginBottom: MARGIN.SM,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS.MD,
    borderColor: COPPER_GREY[300],
  },
  personCellNotEditable: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MARGIN.SM,
  },
  avatar: {
    ...AVATAR_SIZE.MD,
    borderColor: COPPER_GREY[200],
    borderWidth: BORDER_WIDTH,
    marginLeft: PADDING.LG,
  },
  personInfos: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: MARGIN.MD,
  },
  personText: {
    color: COPPER_GREY[800],
    textAlign: 'left',
    marginLeft: MARGIN.MD,
    ...FIRA_SANS_MEDIUM.MD,
    flex: 1,
  },
  sectionText: {
    color: COPPER_GREY[700],
    marginBottom: MARGIN.SM,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MARGIN.MD,
  },
  phone: {
    ...FIRA_SANS_REGULAR.MD,
    color: COPPER[500],
    marginHorizontal: MARGIN.SM,
  },
});
