import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';

import { BackToTopArrow } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton, FloatingButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { CreateAccountDrawer } from '../../../../../shared/src/components/createAccountDrawer/createAccountDrawer';
import { ErrorMessage } from '../../../../../shared/src/components/errorMessage/errorMessage';
import { LoginDrawer } from '../../../../../shared/src/components/loginDrawer/loginDrawer';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H4 } from '../../../../../shared/src/components/text/text';
import { TitleHeader } from '../../../../../shared/src/components/titleHeader/titleHeader';
import { appColors } from '../../../../../src/config';
import { MapView } from '../../components/mapView/mapView';
import { ProviderFilters } from '../../components/providerfilters/providerFilters';
import { ProviderListComponent } from '../../components/providerList/providerListComponent';
import { ProviderSearch } from '../../components/providerSearch/providerSearch';
import { ProviderSorter } from '../../components/providerSorter/providerSorter';
import { TeleHealthCard } from '../../components/teleHealthCard/teleHealthCard';
import { SearchProvider } from '../../model/providerSearchResponse';
import { providerListStyles } from './providerList.styles';
import { useProviderList } from './useProviderList';

export const ProviderListScreen = () => {
  const {
    clearFilters,
    distanceArray,
    selectedProviders,
    providersFiltersInfo,
    isFilterModalEnabled,
    handleScrollToTop,
    loading,
    navigateToProviderDetailScreen,
    onPressMapButton,
    onPressFilterOption,
    onPressFilterSection,
    onCloseFilters,
    isFilterSelected,
    page,
    providersListArray,
    providersResultCount,
    onPressSortButton,
    showMoveToTopIndicator,
    sortArray,
    onMomentumScrollEnd,
    onPressFilterButton,
    onScroll,
    scrollRef,
    onPressAppointmentRequest,
    getSelectedSortInfo,
    getSelectedDistanceInfo,
    onPressSortInfo,
    onPressDistanceInfo,
    isSortEnabled,
    closeModelPopup,
    onSubmitLocation,
    onSubmitCounselor,
    onSubmitPlan,
    alertInfo,
    isAlertEnabled,
    hasEditCounselor,
    onHandleSelectProvider,
    isAppointmentCardDisabled,
    onSubmitProductType,
    isMapViewEnabled,
    onPressListView,
    isLoginDrawerEnabled,
    isCreateAccountDrawerEnabled,
    navigateToMhsudLoginScreen,
    navigateToCreateAccount,
    onPressCreateAccountButton,
    onCloseLoginDrawer,
    onCloseCreateAccountDrawer,
  } = useProviderList();

  const styles = useMemo(() => providerListStyles(), []);

  const { t } = useTranslation();

  const renderItem = ({ item }: { item: SearchProvider }) => {
    return item.providerId ? (
      <ProviderListComponent
        providerInfo={item}
        onPress={() => navigateToProviderDetailScreen(item)}
        onHandleSelectProvider={(index: number) => onHandleSelectProvider(item, index)}
        hasEditCounselor={hasEditCounselor}
      />
    ) : (
      <TeleHealthCard providerInfo={item} />
    );
  };

  const renderFooter = () => {
    return loading && page !== 0 ? (
      <View style={styles.loaderViewStyle}>
        <ActivityIndicator style={styles.loader} size="large" color={appColors.purple} />
      </View>
    ) : null;
  };

  const renderSelectedProviders = () => {
    return (
      <View
        style={[styles.resultCountView, isAppointmentCardDisabled && styles.disableResultCountView]}
        testID="providerList.selectedResultCountView"
      >
        <H1 style={[styles.resultText, isAppointmentCardDisabled && styles.disableText]}>
          {t('providers.selectedProviderMessage').replace(
            '${selectedproviders}',
            selectedProviders ? selectedProviders.length.toString() : '0'
          )}
        </H1>
        <ActionButton
          title={t('providers.requestAppointmentText')}
          style={[styles.disableContinueButton, isAppointmentCardDisabled && styles.continueButton]}
          textStyle={[styles.continueButtonText, isAppointmentCardDisabled && styles.disableContinueButtonText]}
          onPress={onPressAppointmentRequest}
          testID={'provider.continueButton'}
          disabled={isAppointmentCardDisabled}
        />
      </View>
    );
  };

  return (
    <>
      {page === 0 && loading ? (
        <ProgressLoader
          isVisible={loading}
          showLoaderImage={!isFilterModalEnabled}
          backdropOpacity={isFilterModalEnabled ? 0 : 0.7}
        />
      ) : null}
      {isFilterModalEnabled ? (
        <ProviderFilters
          onCloseModal={onCloseFilters}
          filtersList={providersFiltersInfo}
          onPressFilterOption={onPressFilterOption}
          onPressFilterSection={onPressFilterSection}
          onPressResults={onCloseFilters}
          isResultEnabled={isFilterSelected}
          submitButtonTitle={
            !isFilterSelected && !loading
              ? t('providers.search')
              : page === 0 && loading
                ? t('providers.searching')
                : `${t('providers.show')} ${providersResultCount} ${t(
                    providersResultCount === 1 ? 'providers.result' : 'providers.results'
                  )}`
          }
          resultButtonStyle={loading ? styles.searching : null}
          distanceList={distanceArray}
          onPressDistanceInfo={onPressDistanceInfo}
          selectedDistanceLabel={getSelectedDistanceInfo.label}
        />
      ) : (
        <>
          <MainHeaderComponent leftArrow={false} />
          {isMapViewEnabled && providersListArray.length > 0 ? (
            <MapView
              data={providersListArray}
              onPressListView={onPressListView}
              onPressViewProfile={navigateToProviderDetailScreen}
            />
          ) : (
            <>
              {(selectedProviders && selectedProviders.length > 0) || hasEditCounselor
                ? renderSelectedProviders()
                : null}

              <ScrollView
                keyboardShouldPersistTaps="always"
                ref={scrollRef}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={({ nativeEvent }) => onScroll(nativeEvent.contentOffset.y)}
                style={styles.providerScrollView}
              >
                <TitleHeader title={t('providers.findAProvider')} />

                <ProviderSearch
                  containerStyle={styles.providerSearch}
                  hasSearchButton={false}
                  onSubmitCounselor={onSubmitCounselor}
                  onSubmitLocation={onSubmitLocation}
                  onSubmitPlan={onSubmitPlan}
                  onPressMapButton={onPressMapButton}
                  onPressFilterButton={onPressFilterButton}
                  onPressSortButton={onPressSortButton}
                  onSubmitProductType={onSubmitProductType}
                />

                <View style={styles.counsellorView}>
                  {!loading && providersResultCount === 0 ? (
                    <View style={styles.errorMessage}>
                      <ErrorMessage title={t('errors.noResultsFound')} testId={t('errors.noResultsFound')} />
                    </View>
                  ) : null}
                  {!(page === 0 && loading) ? (
                    <View style={styles.subtitleView}>
                      <View style={styles.searchResultsTitle}>
                        <H1
                          style={[
                            styles.result,
                            providersResultCount === 0 ? styles.zeroResultsText : styles.providersResultCountText,
                          ]}
                        >
                          {providersResultCount}
                        </H1>

                        <H1 style={styles.resultFound}>
                          {t('common.space')}
                          {t('providers.filteredResults')}
                        </H1>
                      </View>

                      {isFilterSelected ? (
                        <TouchableOpacity
                          style={styles.clearFilterContainer}
                          onPress={clearFilters}
                          testID={'provider.clearfilters'}
                        >
                          <H4 style={styles.clearFilter}>{t('providers.clearFilters')}</H4>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ) : null}
                  <FlatList
                    scrollEnabled={false}
                    style={styles.notificationListStyle}
                    data={providersListArray}
                    keyExtractor={(item, index) =>
                      item.providerId ? `${item.providerId}-${index}` : `${item.description}-${index}`
                    }
                    renderItem={renderItem}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={
                      (selectedProviders && selectedProviders.length > 0) || hasEditCounselor
                        ? styles.flatListContentContainerWithProvidersSelect
                        : styles.flatListContentContainer
                    }
                  />
                </View>
              </ScrollView>
              <View style={styles.bottomContainer}>
                {showMoveToTopIndicator ? (
                  <FloatingButton
                    icon={<BackToTopArrow />}
                    title={t('providers.backToTop')}
                    onPress={handleScrollToTop}
                    testID="providers.backToTop"
                  />
                ) : null}
              </View>

              {isLoginDrawerEnabled ? (
                <LoginDrawer
                  onPressPrimaryButton={navigateToMhsudLoginScreen}
                  isDrawerEnabled={isLoginDrawerEnabled}
                  onCloseDrawer={onCloseLoginDrawer}
                  onPressSecondaryButton={onPressCreateAccountButton}
                />
              ) : null}

              {!isLoginDrawerEnabled && isCreateAccountDrawerEnabled ? (
                <CreateAccountDrawer
                  isDrawerEnabled={isCreateAccountDrawerEnabled}
                  onCloseDrawer={onCloseCreateAccountDrawer}
                  onPressPrimaryButton={navigateToCreateAccount}
                />
              ) : null}

              {!loading ? (
                <Drawer
                  styles={styles.drawer}
                  hideDrawerHeader
                  visible={isSortEnabled}
                  onRequestClose={closeModelPopup}
                  headerAccessibilityLabel={isSortEnabled ? t('providers.sortBy') : t('providers.distance')}
                  children={
                    <>
                      {isSortEnabled ? (
                        <ProviderSorter
                          dataArray={sortArray}
                          title={t('providers.sortBy')}
                          selectedInfo={getSelectedSortInfo}
                          onPress={onPressSortInfo}
                        />
                      ) : null}
                    </>
                  }
                />
              ) : null}
              {isAlertEnabled && alertInfo ? (
                <AlertModel
                  modalVisible={isAlertEnabled}
                  onHandlePrimaryButton={alertInfo.onHandlePrimaryButton}
                  onHandleSecondaryButton={alertInfo.onHandleSecondaryButton}
                  title={alertInfo.title}
                  subTitle={alertInfo.subTitle}
                  primaryButtonTitle={alertInfo.primaryButtonTitle}
                  secondaryButtonTitle={alertInfo.secondaryButtonTitle}
                  showIndicatorIcon={true}
                  isError={alertInfo.isError}
                  errorIndicatorIconColor={alertInfo.errorIndicatorIconColor}
                />
              ) : null}
            </>
          )}
        </>
      )}
    </>
  );
};
