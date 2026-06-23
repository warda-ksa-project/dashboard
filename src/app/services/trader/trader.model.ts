export interface TraderAddress {
  id: number;
  street: string;
  expalinedAddress: string;
  cityId: number;
  latitude: number;
  longitude: number;
}

export interface UpdateProfileReqBody {
  name: string;
  email: string;
  storeName: string;
  arDescription: string;
  enDescription: string;
  image: string;
  numberOfBranches: number;
  addresses: TraderAddress[];
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
  phoneCountryCode: string;
  arDescription: string;
  enDescription: string;
}
