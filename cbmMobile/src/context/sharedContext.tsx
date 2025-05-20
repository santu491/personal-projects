/* eslint-disable react/jsx-max-depth */
import React from 'react';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { AppointmentContext } from './appointmentContext';
import { AuthContext } from './authContext';
import { ChatContext } from './chatContext';
import { ClientContext } from './clientContext';
import { HomeContext } from './homeContextWrapper';
import { MenuContext } from './menuContextWrapper';
import { NotificationContext } from './notificationContext';
import { ProviderContext } from './providerContext';
import { WellbeingContext } from './wellbeingContextWrapper';

export const SharedContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <AutocompleteDropdownContextProvider>
      <ChatContext>
        <NotificationContext>
          <ClientContext>
            <HomeContext>
              <AppointmentContext>
                <WellbeingContext>
                  <MenuContext>
                    <AuthContext>
                      <ProviderContext>{children}</ProviderContext>
                    </AuthContext>
                  </MenuContext>
                </WellbeingContext>
              </AppointmentContext>
            </HomeContext>
          </ClientContext>
        </NotificationContext>
      </ChatContext>
    </AutocompleteDropdownContextProvider>
  );
};
