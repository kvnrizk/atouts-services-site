// API Types and Interfaces

export interface QuoteRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  project_type?: string;
  message: string;
  surface_area?: string;
  rooms?: string;
  current_state?: string;
  desired_timeline?: string;
  budget_range?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface QuoteRequestResponse extends QuoteRequest {
  id: number;
  status: 'nouveau' | 'en_cours' | 'traite' | 'archive';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  full_name: string;
}

export interface QuoteRequestStats {
  total: number;
  nouveau: number;
  en_cours: number;
  traite: number;
}

export interface Portfolio {
  id?: number;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadResponse {
  filename: string;
  url: string;
  originalname: string;
  size: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface BeforeAfter {
  id?: number;
  title: string;
  description?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  category: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CityPage {
  id?: number;
  slug: string;
  cityName: string;
  department?: string;
  postalCode?: string;
  content: string;
  heroImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id?: number;
  clientName: string;
  clientCity?: string;
  rating: number;
  comment: string;
  projectType?: string;
  published?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceReference {
  id?: number;
  category: string;
  workItem: string;
  label: string;
  unit: string;
  priceLow: number;
  priceMid: number;
  priceHigh: number;
  active?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Estimation {
  id?: number;
  sessionId: string;
  category: string;
  surfaceArea: number;
  rooms?: number;
  qualityLevel: string;
  selectedItems: Array<{
    workItem: string;
    label: string;
    quantity: number;
    unit: string;
    unitPriceLow: number;
    unitPriceMid: number;
    unitPriceHigh: number;
  }>;
  totalLow: number;
  totalMid: number;
  totalHigh: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  convertedToQuote?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EstimationResult {
  sessionId: string;
  totalLow: number;
  totalMid: number;
  totalHigh: number;
  items: Array<{
    label: string;
    quantity: number;
    unit: string;
    totalLow: number;
    totalMid: number;
    totalHigh: number;
  }>;
}

export interface EstimationStats {
  total: number;
  withContact: number;
  conversionRate: number;
  avgEstimate: number;
}
