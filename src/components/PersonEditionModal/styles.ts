import { StyleSheet } from 'react-native';
import { COPPER_GREY, WHITE } from '../../styles/colors';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../styles/fonts';
import { AVATAR_SIZE, BORDER_WIDTH, MARGIN, PADDING } from '../../styles/metrics';

export default ({ isSelectedPerson }: { isSelectedPerson?: boolean }) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.LG,
    paddingBottom: PADDING.LG,
    borderBottomColor: COPPER_GREY[200],
    borderBottomWidth: 1,
  },
  searchBar: {
    flex: 1,
    marginLeft: MARGIN.LG,
  },
  personItem: {
    paddingHorizontal: PADDING.LG,
    paddingVertical: PADDING.MD,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isSelectedPerson ? COPPER_GREY[100] : WHITE,
  },
  personItemText: {
    ...(isSelectedPerson ? { ...FIRA_SANS_BOLD.MD } : { ...FIRA_SANS_REGULAR.MD }),
    flex: 1,
  },
  avatar: {
    ...AVATAR_SIZE.SM,
    borderColor: COPPER_GREY[200],
    borderWidth: BORDER_WIDTH,
    marginRight: MARGIN.MD,
  },
});
