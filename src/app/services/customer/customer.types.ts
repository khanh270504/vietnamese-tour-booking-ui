export interface CustomerProfileResponse {
    id: number;
    fullName: string;
    phone: string;
    address: string;
    nationality: string;
    identityType: string; // CCCD, PASSPORT
    identityNumber: string;
    email: string;
    loyaltyPoints: number;
}

export interface CustomerUpdateProfileRequest {
    fullName: string;
    phone: string;
    address: string;
    nationality: string;
    identityType: string;
    identityNumber: string;
}