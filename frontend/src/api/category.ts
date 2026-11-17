export async function getCategories(gender?: "men" | "women") {
    try {
        const url = gender
            ? `http://localhost:3000/categories?gender=${gender}`
            : "http://localhost:3000/categories";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}