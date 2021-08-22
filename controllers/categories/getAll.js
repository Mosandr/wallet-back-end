const { category: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const categoriesList = await service.getAll()
    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Find list of categories',
      data: {
        categoriesList,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = getAll
