import { APP_IMAGES } from '../appImages';

jest.mock('../../assets/images/check_unselected.png', () => 'mocked_check_unselected.png');
jest.mock('../../assets/images/check_selected.png', () => 'mocked_check_selected.png');

describe('APP_IMAGES', () => {
  test('should have correct paths for CHECK_UNSELECTED', () => {
    expect(APP_IMAGES.CHECK_UNSELECTED).toBe('mocked_check_unselected.png');
  });

  test('should have correct paths for CHECK_SELECTED', () => {
    expect(APP_IMAGES.CHECK_SELECTED).toBe('mocked_check_selected.png');
  });
});
