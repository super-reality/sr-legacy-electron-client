/* eslint-disable import/prefer-default-export */

export async function forEach (items: any, fn: any) {
    if (items && items.length) {
        await Promise.all(
            items.map(async (item) => {
            await fn(item);
        }));
    }
}

// export async function reduce (items, fn, initialValue) {
//     await forEach(items, async (item) => {
//         initialValue = await fn(initialValue, item);
//     })
//     return initialValue;
// }