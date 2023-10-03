// taxController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getTaxesSiigo = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.TaxesApi()

    const data = await apiInstance.getTaxes()
    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export { getTaxesSiigo }