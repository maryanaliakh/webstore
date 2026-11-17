export async function getCollections(gender?: "men" | "women") {
    try {
        const url = gender
            ? `http://localhost:3000/collections?gender=${gender}`
            : "http://localhost:3000/collections";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getLatestCollection() {
    try {
        const response = await fetch('http://localhost:3000/latest-collection');

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}