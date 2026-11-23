export type UserRole = 'client' | 'provider';
export interface UserRoles {
    client: true;
    /** true only once providerEligibilityService says the account qualifies */
    provider: boolean;
}
export interface AppUser {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    phoneVerified: boolean;
    roles: UserRoles;
    activeRole: UserRole;
    createdAt: string;
    isAdmin?: boolean;
}
