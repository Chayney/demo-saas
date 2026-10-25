export type Project = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    companyId: number;
    customerId: number;
    customer: {
        id: number;
        email: string;
        name: string;
        phone: string;
        address: string;
    };
};