// Application Constants

export const APP_NAME = 'Atouts Services';

export const COMPANY_INFO = {
  name: 'Atouts Services',
  email: 'contact@atouts-services.fr',
  phone: '01 XX XX XX XX',
  address: 'Issy-les-Moulineaux, Hauts-de-Seine (92)',
  hours: {
    weekday: 'Lun - Ven: 8h00 - 18h00',
    saturday: 'Sam: 9h00 - 17h00',
  },
};

export const PROJECT_TYPES = [
  { value: 'peinture', label: 'Peinture' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'salles-de-bains', label: 'Salle de bain' },
  { value: 'revetements-sol', label: 'Revêtement de sol' },
  { value: 'autre', label: 'Autre' },
];

export const QUOTE_REQUEST_STATUS = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  archive: 'Archivé',
} as const;

export const SERVICE_AREAS = [
  'Issy-les-Moulineaux',
  'Boulogne-Billancourt',
  'Meudon',
  'Sèvres',
  'Vanves',
  'Clamart',
  'Paris',
];
