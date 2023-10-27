
export default async function timeout(timeout: number = 1): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}