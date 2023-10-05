import * as SiigoApi from 'siigo_api';

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
  res.status(200).json({
    status: 'success',
    message: 'createProduct works!'
  });
};

const updateProductSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'updateProduct works!'
  });
};

const deleteProductSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'deleteProduct works!'
  });
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
