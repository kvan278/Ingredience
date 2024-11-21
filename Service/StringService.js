// services/StringService.js

class StringService {
    static generateRandomPassword(passwordLength = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }

    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static camelCaseToSnakeCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }

    static generateUniqueIdentifier(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let identifier = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            identifier += characters[randomIndex];
        }
        return identifier;
    }
}

module.exports = StringService;
