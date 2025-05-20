import '@testing-library/jest-native/extend-expect';

require('react-native-reanimated').setUpTests();

import { cleanup } from '@testing-library/react-native';

afterEach(cleanup);
