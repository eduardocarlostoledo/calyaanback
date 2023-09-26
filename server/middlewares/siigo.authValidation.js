// invoiceController.js
// Import user model
import * as SiigoApi from 'siigo_api';

const authValidation = async (req, res, next) => {
  if (SiigoApi.ApiClient.instance != undefined) { next() }

  if (SiigoApi.ApiClient.instance == undefined) {
    res.status(401).json({
      status: 'Error',
      message: 'You are not authenticated'
    })
  }
}
//module.exports = authValidation
//export { authValidation }
export default authValidation;