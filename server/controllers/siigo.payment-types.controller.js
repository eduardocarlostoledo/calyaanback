// paymentTypesController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getPaymentType = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.PaymentTypeApi()
    const opts = {
      documentType: req.params.type
    }

    const data = await apiInstance.getPaymentType(opts)
    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export { getPaymentType }