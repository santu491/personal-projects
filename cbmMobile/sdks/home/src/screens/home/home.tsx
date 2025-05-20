import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ApiFailError } from '../../../../../shared/src/components/apiFailError/apiFailError';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H2 } from '../../../../../shared/src/components/text/text';
import { CriticalEventCard } from '../../components/homeCard/criticalEventCard/criticalEventCard';
import { ExploreMoreCard } from '../../components/homeCard/exploreMoreCard/exploreMoreCard';
import { FeaturedItemsCard } from '../../components/homeCard/featuredItemsCard/featuredItemsCard';
import { FindProviderCard } from '../../components/homeCard/findProvider/findProvider';
import { HomeCard } from '../../components/homeCard/homeCard';
import { ServicesCard } from '../../components/homeCard/servicesCard/servicesCard';
import { NotificationInfoTooltip } from '../../components/notificationInfoTooltip/notificationInfoTooltip';
import { CardType } from '../../config/constants/home';
import { ExploreMoreTopicsDTO, HomeCardsData } from '../../model/home';
import { homeStyles } from './home.styles';
import { useHomeView } from './useHome';

export const HomeScreen = () => {
  const {
    navigateToDetails,
    alertInfo,
    isAlertEnabled,
    loading,
    homeContent,
    loggedIn,
    supportNumber,
    onPressContact,
    isShownErrorMessage,
    homeData,
  } = useHomeView();

  const renderHomeCards = (cardSection: HomeCardsData) => {
    switch (cardSection.uiComponent) {
      case CardType.BANNER_WITH_PRIMARY_BUTTON:
        return (
          <>
            {cardSection.data?.map((bodyData) => (
              <FindProviderCard
                item={bodyData}
                navigateToDetails={() => navigateToDetails(bodyData)}
                key={bodyData.title}
              />
            ))}
          </>
        );

      case CardType.CAROUSEL_WITH_ICON_BOTTOM_RIGHT:
        return (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[homeStyles.rowDirection, homeStyles.serviceView]}
          >
            {cardSection.data
              ?.slice(0, cardSection.scrollLimit)
              .map((bodyData) => (
                <ServicesCard
                  item={bodyData}
                  navigateToDetails={() => navigateToDetails(bodyData)}
                  cardStyle={[homeStyles.servicesCardView]}
                  key={bodyData.title}
                />
              ))}
          </ScrollView>
        );
      case CardType.CARD_WITH_OUT_IMAGE:
        return (
          <>
            {cardSection.data?.map((bodyData) => (
              <FeaturedItemsCard
                item={bodyData}
                navigateToDetails={() => navigateToDetails(bodyData)}
                key={bodyData.title}
              />
            ))}
          </>
        );

      case CardType.CARD_WITH_SECONDARY_BUTTON:
        return <CriticalEventCard item={cardSection} navigateToDetails={() => navigateToDetails(cardSection)} />;

      case CardType.CAROUSEL_WITH_CARDS_IMAGE_TOP:
        return (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[homeStyles.rowDirection, homeStyles.resourceView]}
          >
            {cardSection.data?.slice(0, cardSection.scrollLimit).map((bodyData) => (
              <View key={bodyData.title}>
                <HomeCard
                  item={bodyData}
                  navigateToDetails={() => navigateToDetails(bodyData)}
                  cardStyle={[homeStyles.resourceCard, homeStyles.exploreMoreTopicsList]}
                  backgroundImageStyle={homeStyles.backgroundImageStyle}
                  showHorizontalLine={false}
                  tagTextStyle={homeStyles.tagTextStyle}
                  tagViewStyle={homeStyles.tagViewStyle}
                />
              </View>
            ))}
          </ScrollView>
        );
      case CardType.CAROUSEL_TABS_WITH_CARDS_IMAGE_TOP:
        return (
          <ExploreMoreCard
            exploreMoreData={cardSection.data as ExploreMoreTopicsDTO[]}
            navigateToDetails={(item) => navigateToDetails(item)}
          />
        );
      default:
        return null;
    }
  };

  const renderTitle = (item: HomeCardsData) => {
    return (
      <View style={homeStyles.sectionTitleView}>
        <H2 style={homeStyles.sectionTitle}>{item.title}</H2>
        {item.loadMoreLabel ? (
          <TouchableOpacity>
            <Text style={homeStyles.viewAll}>{item.loadMoreLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <>
      <MainHeaderComponent leftArrow={false} />
      <ScrollView style={homeStyles.homeViewMainContainer}>
        {!homeContent && isShownErrorMessage ? (
          <View style={homeStyles.error}>
            <ApiFailError supportNo={supportNumber} onPressContact={onPressContact} />
          </View>
        ) : (
          <View>
            {homeData?.map((item) => {
              return (
                <View key={item.id}>
                  {item.uiComponent && item.title ? renderTitle(item) : null}
                  {renderHomeCards(item)}
                </View>
              );
            })}
            {alertInfo && isAlertEnabled ? (
              <AlertModel
                modalVisible={alertInfo.modalVisible}
                onHandlePrimaryButton={alertInfo.onHandlePrimaryButton}
                onHandleSecondaryButton={alertInfo.onHandleSecondaryButton}
                title={alertInfo.title}
                subTitle={alertInfo.subTitle}
                primaryButtonTitle={alertInfo.primaryButtonTitle}
                secondaryButtonTitle={alertInfo.secondaryButtonTitle}
                showIndicatorIcon={alertInfo.showIndicatorIcon}
                isError={alertInfo.isError}
                errorIndicatorIconColor={alertInfo.errorIndicatorIconColor}
              />
            ) : null}
          </View>
        )}
      </ScrollView>
      {loggedIn && !loading ? <NotificationInfoTooltip /> : null}
      {loading ? <ProgressLoader isVisible={loading} /> : null}
    </>
  );
};
