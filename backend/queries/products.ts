import db from '../db_connection'


interface Product {
    id: number;
    name: string;
    subtitle: string;
    price: string;
    category: string;

    variants: {
        id: number;
        size: string;
        color: string;
        stock: number;
    }[];

    images: {
        id: number;
        color: string;
        url: string;
    }[];

    gender: string;
    description: string;
    material: string;
    care: string;
    origin: string;
}

export async function getProducts(params) {
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (params.search) {
        values.push(params.search);

        conditions.push(`
            (
                products.name ILIKE '%' || $${values.length} || '%'
                OR products.subtitle ILIKE '%' || $${values.length} || '%'
                OR categories.name ILIKE '%' || $${values.length} || '%'
            )
        `);
    }

    if (params.color?.length) {
        const placeholders = params.color.map((color) => {
            values.push(color);
            return `$${values.length}`;
        });

        conditions.push(`
            product_variants.color IN (${placeholders.join(", ")})
        `);
    }

    if (params.size?.length) {
        const placeholders = params.size.map((size) => {
            values.push(size);
            return `$${values.length}`;
        });

        conditions.push(`
            product_variants.size IN (${placeholders.join(", ")})
        `);
    }

    if (params.category?.length) {
        const placeholders = params.category.map((category) => {
            values.push(category);
            return `$${values.length}`;
        });

        conditions.push(`
            categories.name IN (${placeholders.join(", ")})
        `);
    }

    if (params.material?.length) {
        const placeholders = params.material.map((material) => {
            values.push(material);
            return `$${values.length}`;
        });

        conditions.push(`
            products.material IN (${placeholders.join(", ")})
        `);
    }

    if (params.origin?.length) {
        const placeholders = params.origin.map((origin) => {
            values.push(origin);
            return `$${values.length}`;
        });

        conditions.push(`
            products.origin IN (${placeholders.join(", ")})
        `);
    }

    if (params.gender) {
        values.push(params.gender);

        conditions.push(`
            genders.name = $${values.length}
        `);
    }

    if (params.minPrice !== undefined) {
        values.push(params.minPrice);

        conditions.push(`
            products.price >= $${values.length}
        `);
    }

    if (params.maxPrice !== undefined) {
        values.push(params.maxPrice);

        conditions.push(`
            products.price <= $${values.length}
        `);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    let orderBy = "products.id";

    if (params.sort === "asc") {
        orderBy = "products.price ASC";
    } else if (params.sort === "desc") {
        orderBy = "products.price DESC";
    }

    const query = `
        SELECT 
            products.id,
            products.name,
            products.price,
            ARRAY_AGG(DISTINCT product_variants.color) AS colors,
            ARRAY_AGG(DISTINCT product_images.image_url) AS images,
            genders.name AS gender
        FROM products
        JOIN categories 
            ON categories.id = products.category_id
        LEFT JOIN product_variants 
            ON product_variants.product_id = products.id
        LEFT JOIN product_images 
            ON product_images.product_id = products.id
        LEFT JOIN genders 
            ON genders.id = products.gender_id
        ${whereClause}
        GROUP BY 
            products.id,
            products.name,
            products.price,
            genders.name
        ORDER BY ${orderBy};
    `;

    try {
        const result = await db.query<Product>(query, values);

        return result.rows;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}

export async function getProductInfo() {
    const query = `
        SELECT
            ARRAY_AGG(DISTINCT products.price) AS price,
            ARRAY_AGG(DISTINCT products.material) AS material,
            ARRAY_AGG(DISTINCT products.origin) AS origin,
            ARRAY_AGG(DISTINCT categories.name) AS category,
            ARRAY_AGG(DISTINCT genders.name) AS gender,
            ARRAY_AGG(DISTINCT product_variants.size) AS size,
            ARRAY_AGG(DISTINCT product_variants.color) AS color
        FROM products
        JOIN categories
            ON products.category_id = categories.id
        JOIN genders
            ON products.gender_id = genders.id
        JOIN product_variants
            ON product_variants.product_id = products.id
    `;

    try {
        const productInfo = await db.query(query);

        if (productInfo.rows.length === 0) {
            return null;
        }

        const row = productInfo.rows[0];

        return {
            price: row.price,
            color: row.color,
            size: row.size,
            category: row.category,
            material: row.material,
            origin: row.origin,
            gender: row.gender
        };

    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}

export async function getProduct(productId: number) {
    try {
        const productQuery = `
            SELECT
                products.id,
                products.name,
                products.subtitle,
                products.price,
                products.description,
                products.material,
                products.care,
                products.origin,
                categories.name AS category_name,
                genders.name AS gender_name
            FROM products
            JOIN categories
                ON products.category_id = categories.id
            JOIN genders
                ON products.gender_id = genders.id
            WHERE products.id = $1
            LIMIT 1
        `;

        const productResult = await db.query(productQuery, [productId]);
        if (productResult.rows.length === 0) {
            return null;
        }
        const product = productResult.rows[0];

        const variantsQuery = `
            SELECT
                id,
                size,
                color,
                stock
            FROM product_variants
            WHERE product_id = $1
            ORDER BY id
        `;

        const variantsResult = await db.query(variantsQuery, [productId]);

        const imagesQuery = `
            SELECT
                id,
                color,
                image_url
            FROM product_images
            WHERE product_id = $1
            ORDER BY id
        `;

        const imagesResult = await db.query(imagesQuery, [productId]);

        return {
            id: product.id,
            gender: product.gender_name,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            category: product.category_name,

            variants: variantsResult.rows.map(row => ({
                id: row.id,
                size: row.size,
                color: row.color,
                stock: row.stock
            })),

            images: imagesResult.rows.map(row => ({
                id: row.id,
                color: row.color,
                url: row.image_url
            })),

            description: product.description,
            material: product.material,
            care: product.care,
            origin: product.origin
        };
    } catch(error) {
        console.error('Error executing query: ', error);
        throw error;
    }
}

export async function getShipReturn(){
    try {
        const shipQuery = `SELECT * FROM shipping_options`
        const shipOptionsResult = await db.query(shipQuery)

        const returnOptionsQuery= `SELECT * FROM return_options`
        const returnOptionsResult = await db.query(returnOptionsQuery)

        const returnPolicyQuery = `SELECT * FROM return_policy`
        const returnPolicyResult = await db.query(returnPolicyQuery)

        return {
            shipOptions: shipOptionsResult.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                price: row.price,
                delivery_time: row.delivery_time
            })),
            returnOptions: returnOptionsResult.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                price: row.price
            })),
            returnPolicy: returnPolicyResult.rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description
            }))
        }

    } catch(error) {
        console.error('Error executing query: ', error);
        throw error;
    }
}
