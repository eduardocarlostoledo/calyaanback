import express from "express";
import authValidation from "../middlewares/siigo.authValidation.js";
import { siigoLogin, AccountGroup } from "../controllers/siigo.auth.controller.js";
import { createInvoiceSiigo, getInvoiceSiigo, getInvoicePDFSiigo, getElectronicInvoiceErrorsSiigo } from "../controllers/siigo.invoice.controller.js";
import { createCustomer, getCustomer, updateCustomer, deleteCustomer } from "../controllers/siigo.customer.controller.js";
import { getDocumentType } from "../controllers/siigo.document-type.controller.js";
import { createProduct, getProduct, updateProduct, deleteProduct } from "../controllers/siigo.product.controller.js";
import { getPaymentType } from "../controllers/siigo.payment-types.controller.js";
import { getUsers } from "../controllers/siigo.users.controller.js";
import { getTaxes } from "../controllers/siigo.tax.controller.js";


const siigoRoutes = express.Router();
//router.route('/auth').post(AuthController.login)

siigoRoutes.post("/auth", siigoLogin); 
siigoRoutes.get("/account-groups", authValidation, AccountGroup)
siigoRoutes.get("/document-type/", authValidation, getDocumentType)
siigoRoutes.route('/payment-type/').get(authValidation, getPaymentType)


siigoRoutes
  .post('/invoice', authValidation, createInvoiceSiigo)
  .get('/invoice/:id?', authValidation, getInvoiceSiigo)
  .get('/invoice/:id?/PDF', authValidation, getInvoicePDFSiigo)
  .get('/invoice/:id?/errors', authValidation, getElectronicInvoiceErrorsSiigo)



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

  siigoRoutes.route('/users').get(authValidation, getUsers)
  siigoRoutes.route('/taxes').get(authValidation, getTaxes)

export default siigoRoutes;


