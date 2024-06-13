export const getUserLvProgress = (exp: number) => {
    const lv = Math.max(Math.floor(exp / 100), 1)
    const progress = exp % 100
    return {
        lv,
        progress
    }
}