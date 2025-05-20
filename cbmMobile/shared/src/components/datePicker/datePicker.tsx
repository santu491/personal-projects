import { Field, TextInput } from '@sydney/motif-components';
import React, { ComponentProps, useMemo } from 'react';
import { Keyboard, SafeAreaView, TouchableOpacity, View } from 'react-native';
import RNDatePicker from 'react-native-date-picker';

import { CalendarIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { formatDate } from '../../utils/utils';
import { RequiredView } from '../requiredView';
import { datePickerStyles } from './datePicker.styles';

interface DatePickerProps {
  confirmText?: string;
  date: Date | undefined;
  editable: boolean;
  errorMessage?: string;
  filedStyles?: ComponentProps<typeof Field>['styles'];
  hasError?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  onDateChange: (date: Date) => void;
  placeholderText?: string;
  required?: boolean;
  textInputStyles?: ComponentProps<typeof TextInput>['styles'];
  title: string;
}

export const DatePicker = ({
  confirmText,
  date,
  editable,
  errorMessage,
  hasError,
  maximumDate,
  minimumDate,
  onDateChange,
  placeholderText,
  required,
  title,
  filedStyles = {},
  textInputStyles = {},
}: DatePickerProps) => {
  const styles = useMemo(() => datePickerStyles(), []);

  const [show, setShow] = React.useState(false);

  const showDatePicker = () => {
    setShow(!show);
    Keyboard.dismiss();
  };

  const onChange = (selectedDate?: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setShow(false);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Field
          label={title}
          styles={{ ...styles.field, ...(filedStyles as object) }}
          accessoryEnd={required ? <RequiredView /> : null}
          errorMessage={hasError ? errorMessage : undefined}
        >
          <TextInput
            styles={{ ...styles.textInput, ...(textInputStyles as object) }}
            value={formatDate(date)}
            editable={editable}
            onFocus={showDatePicker}
            placeholder={placeholderText ?? ''}
          />
        </Field>
        <TouchableOpacity
          onPress={showDatePicker}
          accessibilityLabel="CalendarIcon"
          accessibilityRole="button"
          style={styles.icon}
        >
          <CalendarIcon />
        </TouchableOpacity>
      </View>
      {show ? (
        <RNDatePicker
          modal
          testID="dateTimePicker"
          mode="date"
          onConfirm={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          date={date ?? maximumDate ?? new Date()}
          open={show}
          confirmText={confirmText}
          buttonColor={appColors.purple}
          title={title}
          accessibilityLabel="Date Picker"
          accessibilityHint="Swipe up or down to adjust the date"
          accessibilityRole="adjustable"
        />
      ) : null}
    </SafeAreaView>
  );
};
