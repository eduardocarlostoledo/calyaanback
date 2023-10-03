// usersController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')
const getUsersSiigo = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.UserApi()
    const opts = {
      page: req.body.page,
      pageSize: req.body.pageSize
    }

    let data = await apiInstance.getUsers(opts)
    res.status(200).json(data)

  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export { getUsersSiigo }