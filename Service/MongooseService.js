class MongooseService {
    constructor(model) {
        this.model = model;
    }

    async find(query = {}, projection = null, options = {}) {
        return this.model.find(query, projection, options);
    }

    async findOne(query = {}, projection = null, options = {}) {
        return this.model.findOne(query, projection, options);
    }

    async findById(id, projection = null, options = {}) {
        return this.model.findById(id, projection, options);
    }

    async create(data) {
        const document = new this.model(data);
        return document.save();
    }

    async update(query, data, options = { new: true }) {
        return this.model.findOneAndUpdate(query, data, options);
    }

    async updateById(id, data, options = { new: true }) {
        return this.model.findByIdAndUpdate(id, data, options);
    }

    async delete(query) {
        return this.model.findOneAndDelete(query);
    }

    async deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }

    async aggregate(pipeline = []) {
        return this.model.aggregate(pipeline);
    }

    async countDocuments(query = {}) {
        return this.model.countDocuments(query);
    }

    async exists(query = {}) {
        return this.model.exists(query);
    }

    async paginate(query = {}, options = {}) {
        const { page = 1, limit = 10, sort = {} } = options;
        const skip = (page - 1) * limit;
        const documents = await this.model.find(query).skip(skip).limit(limit).sort(sort);
        const total = await this.countDocuments(query);
        return { documents, total, page, limit, pages: Math.ceil(total / limit) };
    }

    async bulkInsert(dataArray = []) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
        return this.model.insertMany(dataArray);
    }

    async distinct(field, query = {}) {
        return this.model.distinct(field, query);
    }

    async updateMany(query, data) {
        return this.model.updateMany(query, data);
    }

    async deleteMany(query) {
        return this.model.deleteMany(query);
    }

    async groupBy(field, query = {}) {
        const pipeline = [
            { $match: query },
            { $group: { _id: `$${field}`, count: { $sum: 1 } } }
        ];
        return this.model.aggregate(pipeline);
    }

    async search(field, searchString) {
        const query = { [field]: { $regex: searchString, $options: 'i' } };
        return this.model.find(query);
    }

    async lookup(localField, foreignModel, foreignField, asField, query = {}) {
        const pipeline = [
            { $match: query },
            {
                $lookup: {
                    from: foreignModel.collection.name,
                    localField,
                    foreignField,
                    as: asField
                }
            }
        ];
        return this.model.aggregate(pipeline);
    }

    async sortAndLimit(query = {}, sort = {}, limit = 10) {
        return this.model.find(query).sort(sort).limit(limit);
    }

    async findWithProjection(query = {}, fields = {}) {
        return this.model.find(query).select(fields);
    }
}

module.exports = MongooseService;
