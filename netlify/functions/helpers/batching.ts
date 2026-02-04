export async function fetchGamesInBatches<T, U>(
    items: T[],
    batchSize: number,
    callback: (item: T) => Promise<U>
): Promise<U[]> {
    const results: U[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(callback));
        results.push(...batchResults);
    }
    return results;
}