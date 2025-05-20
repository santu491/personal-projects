import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssistanceType } from '../../models/src/features/immediateAssistance';
import { ProgressLoader } from '../progressLoader';
import { ImmediateAssistance } from './immediateAssistance';
import { immediateAssistanceStyles } from './immediateAssistance.styles';
import { useImmediateAssistance } from './useImmediateAssistance';

export const ImmediateAssistanceComponent = () => {
  const {
    loading,
    showBottomSheet,
    assistanceType,
    memberSupportData,
    immediateAssistanceContact,
    onPressCrisisSupport,
    onPressMemberSupport,
    onPressContact,
    setShowBottomSheet,
    headerInfo,
    memberSupport,
    crisisSupport,
  } = useImmediateAssistance();

  const { t } = useTranslation();

  const styles = useMemo(() => immediateAssistanceStyles(), []);

  return (
    <>
      <ProgressLoader isVisible={loading} />

      <View style={styles.assistanceMainView} testID={'view'}>
        <View style={styles.immediateAssistanceComponentStyle}>
          {memberSupport ? (
            <TouchableOpacity
              onPress={onPressMemberSupport}
              testID={'immediate-assistance-screen-member-support'}
              accessibilityLabel={memberSupport.label}
              accessibilityRole="button"
            >
              <Text style={styles.immediateAssistanceTextStyle} testID={'text-element'}>
                {memberSupport.label}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={onPressCrisisSupport}
            testID={crisisSupport?.label}
            accessibilityLabel={crisisSupport?.label}
            accessibilityRole="button"
          >
            <Text style={styles.immediateAssistanceTextStyle} testID={'text-element'}>
              {crisisSupport?.label ?? t('credibleMind.immediateAssistance.crisisSupport')}
            </Text>
          </TouchableOpacity>
        </View>

        {showBottomSheet ? (
          <Drawer
            styles={styles.drawer}
            hideDrawerHeader
            visible={showBottomSheet}
            onRequestClose={() => setShowBottomSheet(false)}
            children={
              <>
                <ImmediateAssistance
                  contactsInfo={
                    assistanceType === AssistanceType.MEMBER_SUPPORT ? memberSupportData : immediateAssistanceContact
                  }
                  onPressContact={onPressContact}
                  title={
                    assistanceType === AssistanceType.MEMBER_SUPPORT
                      ? headerInfo?.memberSupport?.title
                      : (headerInfo?.crisisSupport?.title ?? t('credibleMind.immediateAssistance.crisisSupport'))
                  }
                />
              </>
            }
          />
        ) : null}
      </View>
    </>
  );
};
