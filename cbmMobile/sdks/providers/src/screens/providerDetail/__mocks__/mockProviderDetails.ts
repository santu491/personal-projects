export const providerData = [
  {
    sectionTitle: 'About the Provider',
    data: [
      {
        title: 'GENDER:',
        tooltip:
          '<p>Gender is self reported on the credentialing application. This element is confirmed and/or validated during the credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
        description: 'FEMALE',
      },
      {
        title: 'RACE:',
      },
      {
        title: 'ETHNICITY:',
      },
      {
        title: 'AGES TREATED:',
        tooltip:
          '<p>Age is self reported on the credentialing application. This element is confirmed and/or validated during the credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
        description: 'All Ages',
      },
      {
        title: 'LANGUAGES SPOKEN:',
        tooltip:
          "<p>This information includes a list of languages spoken by the provider. This information is self-reported and verified during the initial credentialing process and every three years or more often on the provider's credentialing application, which is a signed document in which the provider confirms the information is accurate and complete.</p>\r\n",
        description: 'HEBREW, RUSSIAN, AMERICAN SIGN LANGUAGE, ENGLISH',
      },
    ],
  },
  {
    sectionTitle: 'Provider Details',
    data: [
      {
        title: 'PROVIDER TYPE:',
        description: ['PSYCHIATRIST'],
      },
      {
        title: 'CULTURAL COMPETENCY Training:',
        description: 'NO',
      },
      {
        title: 'Board certification:',
        tooltip:
          '<p>Board Certification (and Certification) demonstrates exceptional expertise in a particular specialty and/or subspecialty, such as psychiatry. In order to be board certified, a practitioner must complete certain requirements beyond those required for licensure, including training and experience in the specialty area. Practitioners must also pass an examination given by the specialty board and must complete continuing education. This information is self-reported by the practitioner and primary source verified during the initial credentialing application process and at least every thirty-six (36) months thereafter during the recredentialing application process. Certification information can be viewed through the following primary resources: Physician (MD) and Doctor of Osteopathy (DO) board certification, go to the American Board of Neurology and Psychiatry (ABPN) website at: <a href="https://application.abpn.com/verifycert/verifycert.asp">https://application.abpn.com/verifycert/verifycert.asp</a> or the American Board of Medical Specialty (ABMS) website at : <a href="https://www.certificationmatters.org/is-your-doctor-board">https://www.certificationmatters.org/is-your-doctor-board</a> , and for Doctors of Osteopathy (DO), go to the American Osteopathic Association website at: <a href="https://certification.osteopathic.org/bureau-of-osteopathic-specialists/">https://certification.osteopathic.org/bureau-of-osteopathic-specialists/</a>. Nurse Practitioner (NP) and Clinical Nurse Specialists (CNS) certification, go to the American Nursing Credentialing Center (ANCC) website at: <a href="https://www.nursingworld.org/certification/verification/">https://www.nursingworld.org/certification/verification/</a>. Physician Assistant (PA) certification, go to the National Commission of Certification of Physician Assistants (NCCPA) website at: <a href="https://www.nccpa.net/verify-pa.aspx">https://www.nccpa.net/verify-pa.aspx</a>. Board Certified Behavioral Analyst (BCBA), go to the Behavioral Analyst Certification Board (BACB) website at: <a href="https://www.bacb.com/verify-certification/">https://www.bacb.com/verify-certification/</a>.</p>\r\n',
        description: 'AMERICAN BOARD OF PROFESSIONAL PSYCHOLOGY\nAMERICAN BOARD OF PSYCHIATRY AND NEUROLOGY',
      },
      {
        title: 'HOSPITAL PRIVILEGES:',
        description: 'YES',
      },
      {
        title: 'NPI:',
        tooltip: '<p>NPI</p>\r\n',
        description: '1558789941',
      },
      {
        title: 'Taxonomy:',
        description: '193400000X\n2084P0800X\n2084P0804X',
      },
      {
        title: 'Office Languages Spoken:',
        tooltip: null,
        description: 'ENGLISH',
      },
      {
        title: 'Product Type:',
        tooltip: null,
        description: 'MENTAL HEALTH / SUBSTANCE ABUSE DISORDER',
      },
    ],
  },
  {
    sectionTitle: 'Telehealth Details',
    data: [
      {
        title: 'Telehealth Services:',
        description: [],
      },
      {
        title: 'Telehealth State License:',
        description: [],
      },
      {
        title: 'Family Caregiver Support:',
        description: 'Not Available',
      },
    ],
  },
  {
    sectionTitle: 'Specialties and Services',
    data: [
      {
        title: 'Services provided:',
        description: [
          'ANXIETY DISORDERS',
          'GRIEF/BEREAVEMENT',
          'OBSESSIVE COMPULSIVE DISORDERS',
          'PANIC/PHOBIA',
          'POST TRAUMATIC STRESS DISORDER',
          'DEPRESSIVE DISORDERS',
          'PSYCHIATRIC EVALUATIONS',
          'BIPOLAR DISORDER',
        ],
      },
    ],
  },
];

export const contacts = {
  sectionTitle: 'Contacts',
  data: [
    {
      title: 'PRACTICE NAME:',
      tooltip:
        '<p>Name is self-reported on the credentialing application. This element is confirmed and/or validated in accordance with Federal No Surprises Act every 90 days and during credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
      description: 'LAWRENCE GENEN MD INC',
    },
    {
      title: 'PHONE:',
      description: '8886842779',
      type: 'PHONE',
    },
    {
      title: 'E-MAIL:',
      description: 'registration@happierliving.com',
      type: 'EMAIL',
    },
    {
      title: 'ADDRESS:',
      description: '11 Park Pl, New York, NY, 10007-2801',
      type: 'ADDRESS',
    },
    {
      title: 'FAX:',
      description: '3233662966',
      type: 'FAX',
    },
    {
      title: 'WEBSITE:',
      description: 'happierliving.com',
      type: 'WEBSITE',
    },
  ],
};

export const providerDetailResponse = {
  providerId: 71326,
  name: {
    displayName: 'VICTORIA KATZ DO',
    firstName: 'VICTORIA',
    lastName: 'KATZ',
  },
  title: 'DO',
  providerType: 'Practitioner',
  contact: {
    address: {
      addr1: '11 Park Pl',
      addr2: '',
      city: 'New York',
      state: 'NY',
      zip: '10007-2801',
      location: {
        lat: 40.71287,
        lon: -74.00817,
      },
    },
    fax: '3233662966',
    officeEmail: 'registration@happierliving.com',
    website: 'happierliving.com',
    phone: '8886842779',
  },
  workHours: [
    {
      day: 'MON',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'TUE',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'WED',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'THU',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'FRI',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'SAT',
      hours: ['7:00 AM - 9:00 PM'],
    },
    {
      day: 'SUN',
      hours: ['7:00 AM - 9:00 PM'],
    },
  ],
  languages: ['HEBREW', 'RUSSIAN', 'AMERICAN SIGN LANGUAGE', 'ENGLISH'],
  specialties: [
    {
      id: 7,
      name: 'ANXIETY DISORDERS',
      sortOrder: 370,
    },
    {
      id: 20,
      name: 'GRIEF/BEREAVEMENT',
      sortOrder: 3920,
    },
    {
      id: 30,
      name: 'OBSESSIVE COMPULSIVE DISORDERS',
      sortOrder: 6070,
    },
    {
      id: 33,
      name: 'PANIC/PHOBIA',
      sortOrder: 6630,
    },
    {
      id: 34,
      name: 'POST TRAUMATIC STRESS DISORDER',
      sortOrder: 7270,
    },
    {
      id: 51,
      name: 'DEPRESSIVE DISORDERS',
      sortOrder: 2770,
    },
    {
      id: 60,
      name: 'PSYCHIATRIC EVALUATIONS',
      sortOrder: 7460,
    },
    {
      id: 67,
      name: 'BIPOLAR DISORDER',
      sortOrder: 750,
    },
  ],
  ageGroups: ['Young Child (0 - 4)', 'Child (5 - 12)', 'Adolescent (13 - 17)', 'Adult (18 - 64)', 'Geriatric (65+) '],
  productType: [
    {
      id: 20000,
      name: 'MENTAL HEALTH / SUBSTANCE ABUSE DISORDER',
      sortOrder: 5,
    },
  ],
  telehealthTypes: {
    flag: false,
    states: [],
    types: [],
  },
  handicap: 'Y',
  publicTransportation: 'Y',
  gender: 'F',
  onlineAppointmentScheduleFlag: 0,
  accreditationsFlag: 0,
  ageRanges: [' 0 - 999 '],
  boardCertFlag: 1,
  culturalCompetenceTrainingFlag: 'Not Available',
  hospitalAffiliationsFlag: 1,
  npi: '1558789941',
  staffLanguages: ['ENGLISH'],
  taxonomyCodes: ['193400000X', '2084P0800X', '2084P0804X'],
  unVerifiedProvider: 0,
  yellowLabels: [
    {
      label: 'Accepting new patients',
      icon: 'accepting-new-patients',
      notAvailable: false,
    },
    {
      icon: 'public-transportation',
      notAvailable: false,
    },
    {
      icon: 'wheelchair-accessible',
      notAvailable: false,
    },
    {
      label: 'Medicaid provider',
      icon: 'medicaid-provider',
    },
  ],
  beaconLocationId: 'F098145',
  sourceSystem: {
    id: '1028193',
    keyName: 'PROVNO',
    systemID: '1',
    location: {
      id: 'F098145',
      keyName: 'VENDOR',
      systemID: '1',
    },
  },
  practiceName: 'LAWRENCE GENEN MD INC',
  boardCertifications: [
    {
      issuer: 'AMERICAN BOARD OF PROFESSIONAL PSYCHOLOGY',
    },
    {
      issuer: 'AMERICAN BOARD OF PSYCHIATRY AND NEUROLOGY',
    },
  ],
  familyCareGiver: 0,
  licenses: [
    {
      licenseLevelCodeDescription: 'PSYCHIATRIST',
      licenseState: 'CA',
      licenseNumber: '18938',
      certificationEntity: 'CALIFORNIA, STATE OF (GENERAL)',
    },
    {
      licenseLevelCodeDescription: 'PSYCHIATRIST',
      licenseState: 'CA',
      licenseNumber: '18938',
      certificationEntity: 'MEDICAL BOARD OF CALIFORNIA',
    },
    {
      licenseLevelCodeDescription: 'PSYCHIATRIST',
      licenseState: 'NY',
      licenseNumber: '287671',
      certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
    },
    {
      licenseLevelCodeDescription: 'PSYCHOLOGIST',
      licenseState: 'NY',
      licenseNumber: '287671',
      certificationEntity: 'NEW YORK, STATE OF (GENERAL)',
    },
  ],
  practiceTypes: ['PSYCHIATRIST'],
  fields: {
    distance: [0.11525962103225093],
  },
  id: 'ggmZPpYBTb0XJdFmiA0-',
  tooltip: {
    practiceNameToolTip:
      '<p>Name is self-reported on the credentialing application. This element is confirmed and/or validated in accordance with Federal No Surprises Act every 90 days and during credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
    genderLabelToolTip:
      '<p>Gender is self reported on the credentialing application. This element is confirmed and/or validated during the credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
    agesTreatedToolTip:
      '<p>Age is self reported on the credentialing application. This element is confirmed and/or validated during the credentialing and re-credentialing process which occurs every 2-3 years depending on state.</p>\r\n',
    languagesSpokenToolTip:
      "<p>This information includes a list of languages spoken by the provider. This information is self-reported and verified during the initial credentialing process and every three years or more often on the provider's credentialing application, which is a signed document in which the provider confirms the information is accurate and complete.</p>\r\n",
    npiToolTip: '<p>NPI</p>\r\n',
    boardCertificationToolTip:
      '<p>Board Certification (and Certification) demonstrates exceptional expertise in a particular specialty and/or subspecialty, such as psychiatry. In order to be board certified, a practitioner must complete certain requirements beyond those required for licensure, including training and experience in the specialty area. Practitioners must also pass an examination given by the specialty board and must complete continuing education. This information is self-reported by the practitioner and primary source verified during the initial credentialing application process and at least every thirty-six (36) months thereafter during the recredentialing application process. Certification information can be viewed through the following primary resources: Physician (MD) and Doctor of Osteopathy (DO) board certification, go to the American Board of Neurology and Psychiatry (ABPN) website at: <a href="https://application.abpn.com/verifycert/verifycert.asp">https://application.abpn.com/verifycert/verifycert.asp</a> or the American Board of Medical Specialty (ABMS) website at : <a href="https://www.certificationmatters.org/is-your-doctor-board">https://www.certificationmatters.org/is-your-doctor-board</a> , and for Doctors of Osteopathy (DO), go to the American Osteopathic Association website at: <a href="https://certification.osteopathic.org/bureau-of-osteopathic-specialists/">https://certification.osteopathic.org/bureau-of-osteopathic-specialists/</a>. Nurse Practitioner (NP) and Clinical Nurse Specialists (CNS) certification, go to the American Nursing Credentialing Center (ANCC) website at: <a href="https://www.nursingworld.org/certification/verification/">https://www.nursingworld.org/certification/verification/</a>. Physician Assistant (PA) certification, go to the National Commission of Certification of Physician Assistants (NCCPA) website at: <a href="https://www.nccpa.net/verify-pa.aspx">https://www.nccpa.net/verify-pa.aspx</a>. Board Certified Behavioral Analyst (BCBA), go to the Behavioral Analyst Certification Board (BACB) website at: <a href="https://www.bacb.com/verify-certification/">https://www.bacb.com/verify-certification/</a>.</p>\r\n',
    secureTextMessagingTooltip:
      '<p>This is communication between a patient and a provider using a HIPAA-compliant digital messaging platform.</p>',
    remoteMonitoringTooltip:
      '<p>When personal health and medical data is collected by a device and transmitted electronically to a provider for use in care and related support.</p>',
    storeForwardTooltip:
      '<p>A provider uses this to transmit a patient’s medical information, such as images and videos, to a provider at another location who uses the information to evaluate the patient remotely.</p>',
    specialtiesAndServicesToolTip:
      "<p>The provider's special field of practice or expertise, which is obtained through the provider's credentialing application. This element is confirmed and/or validated during the initial credentialing process and in accordance with Federal No Surprises Act every 90 days thereafter, and every three years at re-credentialing. The provider will be only listed in a requested specialty that Carelon Behavioral Health can verify and that the provider has the education and training to support the requested specialty.</p>\r\n",
    officeLanguagesSpokenToolTip: null,
    productTypeToolTip: null,
  },
};
