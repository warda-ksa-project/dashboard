export interface TraderAddress {
  id: number;
  street: string;
  expalinedAddress: string;
  cityId: number;
  latitude: number;
  longitude: number;
}

export interface UpdateProfileReqBody {
  id: number;
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  storeName: string;
  cr: string;
  license: string;
  iban: string;
  numberOfBranches: number;
  image: string;
  arDescription: string;
  enDescription: string;
  addresses: {
    id: number;
    expalinedAddress: string;
    cityId: number;
    latitude: number;
    logitude: number;
  }[];
  supportsPickup: boolean;
}

export interface TraderProfile {
  id: number;
  userName: string;
  email: string;
  phone: string;
  storeName: string;
  cr: string;
  license: string;
  iban: string;
  numberOfBranches: number;
  isActive: boolean;
  reviewAverage: number;
  totalReviewCount: number;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  supportsPickup: boolean;
  isAvailable: boolean;
  addresses: TraderAddress[];
  socialMedia: [];

  phoneCountryCode: 'string';
  arDescription: 'string';
  enDescription: 'string';
}
