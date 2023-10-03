// customerController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getCustomerSiigo = async (req, res) => {
  console.log("params getCustomer", req.params, "query getCustomer", req.query)
  let data = {}
  if (req.params.id == undefined) {
    try {
      console.log("params con id undefined")
      const apiInstance = new  SiigoApi.CustomerApi()
      console.log("apiInstance", apiInstance)
      const opts = {
        identification: req.body.identification,
        branchOffice: req.body.branchOffice,
        active: req.body.active,
        type: req.body.type,
        personType: req.body.personType,
        createdStart: req.body.createdStart,
        createdEnd: req.body.createdEnd,
        dateStart: req.body.dateStart,
        dateEnd: req.body.createdEnd,
        updatedStart: req.body.updatedStart,
        updatedEnd: req.body.updatedEnd,
        page: req.body.page,
        pageSize: req.body.pageSize
      }
      console.log("opts", opts)

data = await apiInstance.getCustomers(opts);
      
      console.log("data despues de GetCustomers", data)

      res.status(200).json(data)
    } catch (error) {
      res.json({
        status: 'Error',
        message: 'Something was wrong',
        error: error
      })
    }
  } else {
    try {
      console.log("params con id definido", req.params.id)
      const apiInstance = new  SiigoApi.CustomerApi()
      const id = req.params.id

      data = await apiInstance.getCustomer(id)
      res.status(200).json(data)
    } catch (error) {
      res.json({
        status: 'Error',
        message: 'Something was wrong',
        error: error
      })
    }
  }
}

const createCustomerSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'createCustomer works!'
  })
}

const updateCustomerSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'updateCustomer works!'
  })
}

const deleteCustomerSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'deleteCustomer works!'
  })
}

export { getCustomerSiigo, createCustomerSiigo, updateCustomerSiigo, deleteCustomerSiigo }