export function isPhoneNumber(str: string): boolean {
    const phoneNumberRegex = /^1[3-9]\d{9}$/;
    return phoneNumberRegex.test(str);
}