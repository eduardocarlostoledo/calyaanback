import express from "express";
import authValidation from "../middlewares/siigo.authValidation.js";
import { siigoLogin } from "../controllers/siigo.auth.controller.js";
import { createInvoice, getInvoice, getInvoicePDF, getElectronicInvoiceErrors } from "../controllers/siigo.invoice.controller.js";
import { createCustomer, getCustomer, updateCustomer, deleteCustomer } from "../controllers/siigo.customer.controller.js";
import { getDocumentTypes } from "../controllers/siigo.document-type.controller.js";
import { createProduct, getProduct, updateProduct, deleteProduct } from "../controllers/siigo.product.controller.js";
import { getPaymentTypes } from "../controllers/siigo.payment-types.controller.js";
import { getUsers } from "../controllers/siigo.users.controller.js";
import { getTaxes } from "../controllers/siigo.tax.controller.js";


const siigoRoutes = express.Router();
//router.route('/auth').post(AuthController.login)

siigoRoutes.post("/auth", siigoLogin); 
//siigoRoutes.get("/account-groups", AccountGroupApi)

siigoRoutes
  .post('/invoice', authValidation, createInvoice)
  .get('/invoice/:id?', authValidation, getInvoice)
  .get('/invoice/:id?/PDF', authValidation, getInvoicePDF)
  .get('/invoice/:id?/errors', authValidation, getElectronicInvoiceErrors)

  siigoRoutes.route('/document-type/:type').get(authValidation, getDocumentTypes)

  siigoRoutes.route('/customer/:id?')
  .post(authValidation, createCustomer)
  .get(authValidation, getCustomer)
  .put(authValidation, updateCustomer)
  .delete(authValidation, deleteCustomer)

  siigoRoutes.route('/product/:id?')
  .post(authValidation, createProduct)
  .get(authValidation, getProduct)
  .put(authValidation, updateProduct)
  .delete(authValidation, deleteProduct)

  siigoRoutes.route('/payment-types/:type').get(authValidation, getPaymentTypes)
  siigoRoutes.route('/users').get(authValidation, getUsers)
  siigoRoutes.route('/taxes').get(authValidation, getTaxes)

export default siigoRoutes;


