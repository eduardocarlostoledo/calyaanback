import * as SiigoApi from 'siigo_api';
import axios from 'axios';
import { getAccessToken } from '../helpers/siigoAccessToken.js';

const getAllProductsSiigo = async (req, res) => {
  try {    
    const apiInstance = new SiigoApi.ProductApi();
    const opts = {
      code: req.body.code,
      accountGroup: req.body.accountGroup,
      type: req.body.type,
      stockControl: req.body.stockControl,
      active: req.body.active,
      ids: req.params.ids,
      createdStart: req.body.createdStart,
      createdEnd: req.body.createdEnd,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      updatedStart: req.body.updatedStart,
      updatedEnd: req.body.updatedEnd,
      page: req.body.page,
      pageSize: req.body.pageSize
    };

    const data = await apiInstance.getProducts(opts);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    });
  }
};

const getProductByIdSiigo = async (req, res) => {
  try {
    const apiInstance = new SiigoApi.ProductApi();
    console.log("id: ", req.query.id);
    const id = req.params.id;

    const data = await apiInstance.getProduct(id);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    });
  }
};

const getProductByCodeSiigo = async (req, res) => {
  try {    
    const apiInstance = new SiigoApi.ProductApi();
    const opts = {
      code: req.body.code,
      accountGroup: req.body.accountGroup,
      type: req.body.type,
      stockControl: req.body.stockControl,
      active: req.body.active,
      ids: req.params.ids,
      createdStart: req.body.createdStart,
      createdEnd: req.body.createdEnd,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      updatedStart: req.body.updatedStart,
      updatedEnd: req.body.updatedEnd,
      page: req.body.page,
      pageSize: req.body.pageSize
    };

    const data = await apiInstance.getProducts(opts);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    });
  }
};

const createProductSiigo = async (req, res) => {
  try {    
    const opts = {            
      code: req.body.code,      
      name: req.body.name,      
      account_group: req.body.account_group,
      description: req.body.description,
    };
console.log("OPTIONS CREATE PRODUCT", opts)
const data = await axios.post('https://api.siigo.com/v1/products', opts, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
        'Partner-Id': "calyaanapp",
      }
    });
    res.status(200).json({
      status: 'success',
      message: 'Product created successfully!',
      data: data.data
    });
  } catch (error) {
    console.log("ERROR CREATE PRODUCT", error)
    if (error.response && error.response.data) {
      //si la respuesta contiene 'data' con un 'Status' and 'Errors'
      console.error('Error Status:', error.response.data.Status);
      console.error('Errors:', error.response.data.Errors);
      res.status(error.response.status).json(error.response.data);
    } else {
      // si no, que muestre el error que retorna la api.
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
};

const updateProductSiigo = async (req, res) => {
  try {        
    const id = req.params.id;
    const opts = {            
      code: req.body.code,      
      name: req.body.name,      
      account_group: req.body.account_group,
      type: req.body.type,
      stock_control: req.body.stock_control,
      active: req.body.active,
      tax_classification: req.body.tax_classification,
      tax_included: req.body.tax_included,
      tax_consumption_value: req.body.tax_consumption_value,
      taxes: req.body.taxes,
      prices: req.body.prices,
      description: req.body.description,
      additional_fields: req.body.additional_fields,
    };
console.log("OPTIONS updateProductSiigo PRODUCT", id, opts)
const data = await axios.put(`https://api.siigo.com/v1/products/${id}`, opts, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
        'Partner-Id': "calyaanapp"        
      }
    });
    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully!',
      data: data.data
    });
  } catch (error) {
    console.log("ERROR UPDATE PRODUCT", error)
    if (error.response && error.response.data) {
      //si la respuesta contiene 'data' con un 'Status' and 'Errors'
      console.error('Error Status:', error.response.data.Status);
      console.error('Errors:', error.response.data.Errors);
      res.status(error.response.status).json(error.response.data);
    } else {
      // si no, que muestre el error que retorna la api.
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
};

const deleteProductSiigo = async (req, res) => {
  try {        
    const id = req.params.id;    
console.log("OPTIONS deleteProductSiigo PRODUCT", id)
const data = await axios.delete(`https://api.siigo.com/v1/products/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
        'Partner-Id': "calyaanapp"        
      }
    });
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully!',
      data: data.data
    });
  } catch (error) {
    console.log("ERROR deleteProductSiigo PRODUCT", error)
    if (error.response && error.response.data) {
      //si la respuesta contiene 'data' con un 'Status' and 'Errors'
      console.error('Error Status:', error.response.data.Status);
      console.error('Errors:', error.response.data.Errors);
      res.status(error.response.status).json(error.response.data);
    } else {
      // si no, que muestre el error que retorna la api.
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
};

export { getProductByCodeSiigo, getAllProductsSiigo, getProductByIdSiigo, createProductSiigo, updateProductSiigo, deleteProductSiigo };

// // productController.js
// // Import user model
//  import * as SiigoApi from 'siigo_api';
// // Handle index actions
// //const environment = require('../config/environment')

// const getProductSiigo = async (req, res) => {
//   if (req.params.id == undefined) {
//     try {
//       const apiInstance = new  SiigoApi.ProductApi()
//       const opts = {
//         code: req.body.code,
//         accountGroup: req.body.accountGroup,
//         type: req.body.type,
//         stockControl: req.body.stockControl,
//         active: req.body.active,
//         ids: req.params.ids,
//         createdStart: req.body.createdStart,
//         createdEnd: req.body.createdEnd,
//         dateStart: req.body.dateStart,
//         dateEnd: req.body.dateEnd,
//         updatedStart: req.body.updatedStart,
//         updatedEnd: req.body.updatedEnd,
//         page: req.body.page,
//         pageSize: req.body.pageSize
//       }

//       const data = await apiInstance.getProducts(opts)
//       res.status(200).json(data)
//     } catch (error) {
//       res.json({
//         status: 'Error',
//         message: 'Something was wrong',
//         error: error
//       })
//     }
//   } else {
//     try {
//       const apiInstance = new  SiigoApi.ProductApi()
//       console.log("id: ", req.params.id)
//       const id = req.params.id

//       const data = await apiInstance.getProduct(id)
//       res.status(200).json(data)
//     } catch (error) {
//       res.json({
//         status: 'Error',
//         message: 'Something was wrong',
//         error: error
//       })
//     }
//   }
// }

// const createProductSiigo = async (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'createProduct works!'
//   })
// }

// const updateProductSiigo = async (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'updateProduct works!'
//   })
// }

// const deleteProductSiigo = async (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'deleteProduct works!'
//   })
// }

// export {   getProductSiigo,   createProductSiigo,   updateProductSiigo,   deleteProductSiigo }
