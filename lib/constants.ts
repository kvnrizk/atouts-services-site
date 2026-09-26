// Application Constants

export const APP_NAME = 'Atouts Services';

export const COMPANY_INFO = {
  name: 'Atouts Services',
  email: 'atouts.services92@gmail.com',
  phone: '06 34 02 61 80',
  /** International format for tel: links — one format everywhere (consistent NAP for local SEO). */
  phoneHref: 'tel:+33634026180',
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

/** Readable label for a project type slug ("salles-de-bains" -> "Salle de bain"); unknown values are capitalised */
export function projectTypeLabel(value?: string | null): string | undefined {
  if (!value) return undefined;
  return PROJECT_TYPES.find((p) => p.value === value)?.label ?? value.charAt(0).toUpperCase() + value.slice(1);
}

export const QUOTE_REQUEST_STATUS = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  archive: 'Archivé',
} as const;

/** Priority towns around the Issy base, then Paris. The wider region is SERVICE_REGION. */
export const SERVICE_AREAS = [
  'Issy-les-Moulineaux',
  'Boulogne-Billancourt',
  'Vanves',
  'Meudon',
  'Sèvres',
  'Clamart',
  'Paris',
];

/** Whole region served (Paris & Île-de-France). */
export const SERVICE_REGION = 'Île-de-France';

export const GOOGLE_MAPS_CENTER = {
  lat: 48.8235,
  lng: 2.2735,
} as const;

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'issy-les-moulineaux': { lat: 48.8235, lng: 2.2735 },
  'boulogne-billancourt': { lat: 48.8397, lng: 2.2399 },
  'meudon': { lat: 48.8122, lng: 2.2356 },
  'sevres': { lat: 48.8236, lng: 2.2105 },
  'vanves': { lat: 48.8208, lng: 2.2893 },
  'clamart': { lat: 48.8027, lng: 2.2636 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'paris-15': { lat: 48.8412, lng: 2.3003 },
  'paris-16': { lat: 48.8637, lng: 2.2769 },
};
