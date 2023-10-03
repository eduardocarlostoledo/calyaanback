import express from "express";
import authValidation from "../middlewares/siigo.authValidation.js";
import { siigoLogin, AccountGroup } from "../controllers/siigo.auth.controller.js";
import { createInvoiceSiigo, getInvoiceSiigo, getInvoicePDFSiigo, getElectronicInvoiceErrorsSiigo } from "../controllers/siigo.invoice.controller.js";
import { createCustomerSiigo, getCustomerSiigo, updateCustomerSiigo, deleteCustomerSiigo } from "../controllers/siigo.customer.controller.js";
import { getDocumentType } from "../controllers/siigo.document-type.controller.js";
import { createProductSiigo, getProductSiigo, updateProductSiigo, deleteProductSiigo } from "../controllers/siigo.product.controller.js";
import { getPaymentType } from "../controllers/siigo.payment-types.controller.js";
import { getUsersSiigo } from "../controllers/siigo.users.controller.js";
import { getTaxesSiigo } from "../controllers/siigo.tax.controller.js";


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



  siigoRoutes
  .post('/create-customer/', authValidation, createCustomerSiigo)
  .get('/get-customer/', authValidation, getCustomerSiigo)
  .put('/update-customer/', authValidation, updateCustomerSiigo)
  .delete('/delete-customer/', authValidation, deleteCustomerSiigo)

  siigoRoutes
  .post('/product/', authValidation, createProductSiigo)
  .get('/product/:id?', authValidation, getProductSiigo)
  .put('/product/:id?', authValidation, updateProductSiigo)
  .delete('/product/:id?', authValidation, deleteProductSiigo)

  siigoRoutes.route('/users').get(authValidation, getUsersSiigo)
  siigoRoutes.route('/taxes').get(authValidation, getTaxesSiigo)

export default siigoRoutes;


