// paymentTypesController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getPaymentType = async (req, res) => {
  try {
    console.log("getDocumentTypes", req.query);    
    const opts = {
      documentType: req.query.document_type,
    };
    const apiInstance = new  SiigoApi.PaymentTypeApi()
    const data = await apiInstance.getPaymentTypes(opts);
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