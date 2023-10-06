import express from "express";
import authValidation from "../middlewares/siigo.authValidation.js";
import { siigoLogin, AccountGroup } from "../controllers/siigo.auth.controller.js";
import { createInvoiceSiigo, getInvoiceSiigo, getInvoicePDFSiigo, getElectronicInvoiceErrorsSiigo } from "../controllers/siigo.invoice.controller.js";
import { createCustomerSiigo, getAllCustomersSiigo, getCustomerByIdSiigo, updateCustomerSiigo, deleteCustomerSiigo, getCustomersIdentificationSiigo } from "../controllers/siigo.customer.controller.js";
import { getDocumentType } from "../controllers/siigo.document-type.controller.js";
import { createProductSiigo, getAllProductsSiigo, getProductByIdSiigo, updateProductSiigo, deleteProductSiigo, getProductByCodeSiigo } from "../controllers/siigo.product.controller.js";
import { getPaymentType } from "../controllers/siigo.payment-types.controller.js";
import { getUsersSiigo } from "../controllers/siigo.users.controller.js";
import { getTaxesSiigo } from "../controllers/siigo.tax.controller.js";


const siigoRoutes = express.Router();
//router.route('/auth').post(AuthController.login)

//AUTH
siigoRoutes.post("/auth", siigoLogin); 
siigoRoutes.get("/account-groups", authValidation, AccountGroup)

//DOCUMENT TYPE
siigoRoutes.get("/document-type/", authValidation, getDocumentType)

//PAYMENT TYPE
siigoRoutes.route('/payment-type/').get(authValidation, getPaymentType)

//INVOICE
siigoRoutes
  .post('/invoice', authValidation, createInvoiceSiigo)
  .get('/invoice/:id?', authValidation, getInvoiceSiigo)
  .get('/invoice/:id?/PDF', authValidation, getInvoicePDFSiigo)
  .get('/invoice/:id?/errors', authValidation, getElectronicInvoiceErrorsSiigo)


//CUSTOMER
  siigoRoutes
  .post('/create-customer/', authValidation, createCustomerSiigo)
  .get('/get-customer/', authValidation, getAllCustomersSiigo)
  .post('/get-customer-identification/', authValidation, getCustomersIdentificationSiigo)
  .get('/get-customer/:id', authValidation, getCustomerByIdSiigo)
  .put('/update-customer/:id', authValidation, updateCustomerSiigo)
  .delete('/delete-customer/', authValidation, deleteCustomerSiigo)

  //PRODUCT
  siigoRoutes
    .post('/create-product/', authValidation, createProductSiigo)
    .get('/products', authValidation, getAllProductsSiigo)
    .get('/product/:id', authValidation, getProductByIdSiigo)
    .post('/product-code/', authValidation, getProductByCodeSiigo)
    .put('/update-product/:id', authValidation, updateProductSiigo)
    .delete('/product/:id', authValidation, deleteProductSiigo)

//USERS
  siigoRoutes.route('/users').get(authValidation, getUsersSiigo)

//TAXES
  siigoRoutes.route('/taxes').get(authValidation, getTaxesSiigo)

export default siigoRoutes;


