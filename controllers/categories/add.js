const { category: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')

const add = async (req, res, next) => {
  try {
    const newCategory = { ...req.body }
    const category = await service.add(newCategory)
    res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      data: {
        category,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = add
