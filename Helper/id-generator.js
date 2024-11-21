const { greekNames } = require("./greek-names");

const generateUniqueId = async (model) => {
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
        uniqueId = greekNames[Math.floor(Math.random() * greekNames.length)] +
            Math.floor(Math.random() * 10000).toString();
        const existingDoc = await model.findOne({ id: uniqueId });
        if (!existingDoc) {
            isUnique = true;
        }
    }
    return uniqueId;
};

module.exports = {
    generateUniqueId
}