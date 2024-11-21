// services/FakerService.js

const { faker } = require('@faker-js/faker');

class FakerService {
    static generateName() {
        return faker.name.fullName();
    }

    static generateEmail() {
        return faker.internet.email();
    }

    static generatePhoneNumber() {
        return faker.phone.number();
    }

    static generateAddress() {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
        };
    }

    static generateCompany() {
        return {
            companyName: faker.company.name(),
            catchPhrase: faker.company.catchPhrase(),
            bs: faker.company.bs()
        };
    }

    static generateUserProfile() {
        return {
            name: this.generateName(),
            email: this.generateEmail(),
            phone: this.generatePhoneNumber(),
            address: this.generateAddress(),
            company: this.generateCompany()
        };
    }

    static generateProduct() {
        return {
            productName: faker.commerce.productName(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            description: faker.commerce.productDescription()
        };
    }

    static generateRandomDate(startYear = 2000, endYear = 2022) {
        return faker.date.between(`${startYear}-01-01`, `${endYear}-12-31`);
    }

    static generateLoremText(paragraphs = 1) {
        return faker.lorem.paragraphs(paragraphs);
    }

    static generateUUID() {
        return faker.datatype.uuid();
    }

    static generateImageUrl(width = 200, height = 200) {
        return faker.image.imageUrl(width, height);
    }

    static generateUsers(count = 10) {
        return Array.from({ length: count }, () => this.generateUserProfile());
    }

    static generateProducts(count = 10) {
        return Array.from({ length: count }, () => this.generateProduct());
    }
}

module.exports = FakerService;
