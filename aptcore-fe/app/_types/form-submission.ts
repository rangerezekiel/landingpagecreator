export interface FormSubmission {
    id: string;
    websiteId: string | null;
    name: string | null;
    email: string | null;
    countryCode: string | null;
    phoneCode: string | null;
    phoneNumber: string | null;
    countryPhoneCode: string | null;
    phone: string | null;
    message: string | null;
    readAt: string | null;
    createdAt: string;
    readByUser: ReadByUser | null;
    website?: {
        id: string;
        title: string;
        domain: string;
    } | null;
}

export interface ReadByUser {
    id: string;
    fullName: string | null;
    username: string | null;
}

export interface FormSubmissionIndex {
    id: string;
    websiteId: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    message: string | null;
    website?: {
        id: string;
        title: string;
        domain: string;
    } | null;
}

export interface FormSubmissionIndexResponse {
  meta: object;
  data: FormSubmission[];
}