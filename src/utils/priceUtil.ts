export const formatPrice = (price: number): string => {
    return (price / 100).toFixed(2);
};