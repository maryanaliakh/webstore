export async function getProduct (param: string) {
    try {
        const response = await fetch(`http://localhost:3000/product/${param}`);

        console.log(response)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
    }
}

export async function getProducts (query: string) {
    try {
        const response = await fetch(
            `http://localhost:3000/product/search?q=${encodeURIComponent(query || "")}`
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

