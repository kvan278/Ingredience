const SubjectModel = require('../Models/Subject');
const QuizModel = require('../Models/Quiz');
const CategoryModel = require('../Models/Category');

const models = {
    subject: SubjectModel,
    category: CategoryModel,
    quiz: QuizModel
};

const getParentIdField = (resource) => {
    switch (resource) {
        case 'subject':
            return 'categoryID';
        case 'quiz':
            return 'subjectID';
        default:
            return null;
    }
};

module.exports = {
    models,
    getParentIdField
};
