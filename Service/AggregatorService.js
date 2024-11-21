class AggregatorService {
    static getMailLogs(page = 1, limit = 100) {
        return [
            { $sort: { sentAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { _id: 0, email: 1, type: 1, sentAt: 1 } }
        ];
    }

    static getAllUsersMail() {
        return [
            {
                $group: {
                    _id: '$email'
                }
            },
            {
                $group: {
                    _id: null,
                    users: {
                        $push: '$_id'
                    }
                }
            }
        ]
    }
}

module.exports = AggregatorService;
