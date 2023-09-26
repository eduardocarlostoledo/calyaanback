// usersController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')
const getUsers = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.UsersApi()
    const opts = {
      page: req.body.page,
      pageSize: req.body.pageSize
    }

    const data = await apiInstance.getUsers(opts)
    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export { getUsers }