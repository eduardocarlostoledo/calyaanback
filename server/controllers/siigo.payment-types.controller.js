// paymentTypesController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getPaymentTypes = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.PaymentTypesApi()
    const opts = {
      documentType: req.params.type
    }

    const data = await apiInstance.getPaymentTypes(opts)
    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export { getPaymentTypes }