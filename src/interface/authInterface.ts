export interface IUser {
    userId: string
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    roleId?: string | null;
    community?: string | null;
    state?: string | null;
    localGovernmentArea?: string | null;
    status?: number | null;
    profilePic?: string | null;
    address?: string | null;
    createAt?: string | null;
    updateAt?: string | null;
}
export interface IAuth {
    firstName?: string;
    lastName?: string;
    email: string;
    address?: string;
    phoneNumber?: string;
    community?: string;
    state?: string;
    localGovernmentArea?: string | null;
    roleId?: string | null;
    password: string
}

export interface ISignUpAdmin {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    roleId: string | null;
    trusts: string | null;
    status?: number | null;
}

export interface ISignUpNUPRC {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
}
export interface ISettlorSignUp {
    settlorId: string
    settlorName: string | null;
    omlCode: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhoneNumber: string | null;
}
export interface IDraSignUp {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
}

export interface ILogin {
    email: string;
    password: string;
}


// Views

export interface IUserView {
    userId: number
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    address?: string | null;
    phoneNumber?: string | null;
    role?: string | null;
    status?: number | null;
    community?: string | null;
    state?: string | null;
    localGovernmentArea?: string | null;
    profilePic?: string | null;
    profilePicExtension?: string | null;
    password?: string | null;
}