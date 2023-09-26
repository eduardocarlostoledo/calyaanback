// documentTypeController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getDocumentTypes = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.DocumentTypeApi()
    const opts = {
      type: req.params.type
    }
    const data = await apiInstance.getDocumentTypes(opts)
    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    })
  }
}

export {
  getDocumentTypes}