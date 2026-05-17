export const base64ToBuffer = (base: any) => {
    const base64String = base.split(";base64,").pop()
    return Buffer.from(base64String, "base64")
}