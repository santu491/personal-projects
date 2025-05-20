export interface GetProfileResponse {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  displayName: string;
  displayTitle: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  aboutMe: string;
  interests: string;
  location: string;
  id: string;
  communities?: Array<string>;
  active: boolean;
}

export interface UpdateProfilePayload {
  role?: string; // requiredWhenSuperAdminEdits
  firstName: string;
  lastName: string;
  displayName: string;
  displayTitle: string;
  aboutMe: string;
  interests: string;
  location: string;
  id?: string; // requiredWhenSuperAdminEdits
  communities?: Array<string>; // requiredWhenSuperAdminEdits
  profileImage?: string;
  active?: boolean;
  isPersona?: boolean;
  removed?: boolean;
}

export interface AddUserPayload {
  isPersona?: boolean;
  username: string;
  role: string;
  communities?: Array<string>; // requiredWhenRoleIsSCAdvocate
  firstName?: string;
  lastName?: string;
  displayName?: string;
  aboutMe?: string;
  interests?: string;
  location?: string;
}
