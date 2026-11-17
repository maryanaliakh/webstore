import {prisma} from "../db"

export async function getUserAddresses(userId: number) {
    return prisma.addresses.findMany({
        where: {user_id: userId},
        orderBy: [
            {is_default: "desc"},
            {created_at: "desc"}
        ]
    });
}

export async function createAddress(userId: number, data: {
    name: string;
    phone: string;
    country: string;
    city: string;
    postal_code: string;
    street: string;
    building: string;
    apartment?: string | null;
    is_default?: boolean;
}) {
    return prisma.addresses.create({
        data: {
            ...data,
            user_id: userId
        }
    });
}

export async function deleteAddress(userId: number, addressId: number) {
    return prisma.addresses.deleteMany({
        where: {
            id: addressId,
            user_id: userId
        }
    });
}
