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

interface ProductsFilters {
    search?: string;
    colors?: string;
    sizes?: string;
    categories?: string;
    materials?: string;
    origins?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}

export async function getProducts(filters: ProductsFilters) {
    const values: (string | number)[] = [];
    const conditions: string[] = [];

    if(filters.search) {
        values.push(filters.search)
        conditions.push(`(products.name ILIKE '%' || $${values.length} || '%'
           OR products.subtitle ILIKE '%' || $${values.length} || '%'
           OR categories.name ILIKE '%' || $${values.length} || '%')`)
    }

    if(filters.colors) {
        values.push(filters.colors)
        conditions.push(`
            product_variants.color = $${values.length}
        `);
    }

    if(filters.sizes) {
        values.push(filters.sizes)
        conditions.push(`
            product_variants.size = $${values.length}
        `);
    }

    if(filters.categories) {
        values.push(filters.categories)
        conditions.push(`
            categories.name = $${values.length}
        `);
    }

    if(filters.materials) {
        values.push(filters.materials)
        conditions.push(`
            products.material = $${values.length}
        `);
    }

    if(filters.origins) {
        values.push(filters.origins)
        conditions.push(`
            products.origin = $${values.length}
        `);
    }

    if(filters.minPrice !== undefined) {
        values.push(filters.minPrice)
        conditions.push(`
            products.price >= $${values.length}
        `);
    }

    if(filters.maxPrice !== undefined) {
        values.push(filters.maxPrice)
        conditions.push(`
            products.price <= $${values.length}
        `);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    let orderBy = "products.id";

    if (filters.sort === "high") {
        orderBy = "products.price ASC";
    } else if (filters.sort === "low") {
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

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
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
