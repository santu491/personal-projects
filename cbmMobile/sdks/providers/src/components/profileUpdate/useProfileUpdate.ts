import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ProfileCorrectionForm,
  ProfileCorrectOptions,
  ProfileUpdateFields,
  ReportProfileCorrectionForm,
} from '../../model/providerSearchResponse';
import { getProfileCorrectionValidationSchema } from '../../utils/profileCorrectionValidationSchema';
export interface ProfileUpdateProps {
  closeModal: () => void;
  handleProfileSubmit: (data: ProfileCorrectionForm) => void;
  profileInfo?: ReportProfileCorrectionForm;
}

export const useProfileUpdate = ({ closeModal, profileInfo, handleProfileSubmit }: ProfileUpdateProps) => {
  const [options, setOptions] = useState<ProfileCorrectOptions[] | undefined>(profileInfo?.profileOptions);

  const { profileCorrectionValidationSchema } = getProfileCorrectionValidationSchema();

  const { control, getValues } = useForm<ProfileUpdateFields>({
    mode: 'onChange',
    defaultValues: {
      emailAddress: '',
      firstName: '',
      comments: '',
    },
    resolver: yupResolver(profileCorrectionValidationSchema),
  });

  const onProfileOptionChange = (option: ProfileCorrectOptions) => {
    setOptions((prevOptions) =>
      prevOptions?.map((opt) => (opt.id === option.id ? { ...opt, selected: !opt.selected } : opt))
    );
  };

  const handleSubmit = () => {
    const formData = {
      ...getValues(),
      labels: options
        ?.filter((option) => option.selected)
        .map((option) => {
          delete option.selected;
          return option;
        }),
    };
    closeModal();
    handleProfileSubmit(formData);
  };

  const handleCancel = () => {
    closeModal();
  };

  return {
    control,
    handleCancel,
    onProfileOptionChange,
    handleSubmit,
    options,
  };
};
