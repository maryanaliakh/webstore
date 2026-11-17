import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const shippingOptions = [
        { name: "Delivery to store", description: "Free delivery to a BUBBLE store", price: 0, delivery_time: "2–3 business days" },
        { name: "Next day delivery", description: "Delivery to your home the next business day", price: 12.9, delivery_time: "Next business day" },
        { name: "Standard home delivery", description: "Standard courier delivery to your home", price: 6.9, delivery_time: "2–3 business days" },
        { name: "Same day delivery", description: "Delivery to your home on the same day", price: 19.9, delivery_time: "Same day" },
        { name: "Pickup point", description: "Delivery to a selected pickup point", price: 6.9, delivery_time: "2–3 business days" },
    ];

    for (const option of shippingOptions) {
        await prisma.shipping_options.upsert({
            where: { id: shippingOptions.indexOf(option) + 1 },
            update: option,
            create: option,
        });
    }

    const returnOptions = [
        { id: 1, name: "Return in store", description: "Return your order at any BUBBLE store", price: 0 },
        { id: 2, name: "Pickup point return", description: "Return your order through a selected pickup point", price: 6.9 },
        { id: 3, name: "Courier return", description: "Return your order using a courier", price: 9.9 },
    ];

    for (const option of returnOptions) {
        await prisma.return_options.upsert({
            where: { id: option.id },
            update: option,
            create: option,
        });
    }

    await prisma.return_policy.upsert({
        where: { id: 1 },
        update: {
            title: "30-Day Return Policy",
            description: "Items can be returned within 30 days from the shipment date. Products must be in their original condition, with all labels and original packaging.",
        },
        create: {
            id: 1,
            title: "30-Day Return Policy",
            description: "Items can be returned within 30 days from the shipment date. Products must be in their original condition, with all labels and original packaging.",
        },
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());