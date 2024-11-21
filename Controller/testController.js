const { SUCCESS_TEMPLATE_2 } = require("../Helper/response-templates")

exports.getTest = async (req, res) => {
    res.send(SUCCESS_TEMPLATE_2)
}
