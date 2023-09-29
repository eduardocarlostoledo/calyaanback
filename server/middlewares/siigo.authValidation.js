// invoiceController.js
// Import user model

import * as SiigoApi from 'siigo_api';
//import { SiigoApi } from "../controllers/siigo.auth.controller.js";
import { getAccessToken } from "../helpers/siigoAccessToken.js";

const authValidation = async (req, res, next) => { 
  let accessToken = getAccessToken()
  if (accessToken != undefined) { 
    console.log("EL TOKEN ES VALIDO")
    next() 
  }

  if (accessToken == undefined) {
    res.status(401).json({
      status: 'Error',
      message: 'You are not authenticated'
    })
  }
}
//module.exports = authValidation
//export { authValidation }
export default authValidation;