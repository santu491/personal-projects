import '@testing-library/jest-native/extend-expect';

import { render } from '@testing-library/react-native';
import React from 'react';

import { SectionView } from '../sectionView';

describe('SectionView', () => {
  it('renders header title correctly', () => {
    const headerTitle = 'Section Header';
    const { getByTestId } = render(
      <SectionView headerTitle={headerTitle}>{/* Add any required children here */}</SectionView>
    );
    const headerElement = getByTestId('section-header-title');
    expect(headerElement).toHaveTextContent(headerTitle);
  });

  it('renders subtitle correctly when provided', () => {
    const headerTitle = 'Section Header';
    const subTitle = 'Section Subtitle';
    const { getByTestId } = render(
      <SectionView headerTitle={headerTitle} subTitle={subTitle}>
        {/* Add any required children here */}
      </SectionView>
    );
    const subTitleElement = getByTestId('section-sub-title');
    expect(subTitleElement).toHaveTextContent(subTitle);
  });

  it('does not render subtitle when not provided', () => {
    const headerTitle = 'Section Header';
    const { queryByTestId } = render(
      <SectionView headerTitle={headerTitle}>{/* Add any required children here */}</SectionView>
    );
    const subTitleElement = queryByTestId('section-sub-title');
    expect(subTitleElement).toBeNull();
  });
});
