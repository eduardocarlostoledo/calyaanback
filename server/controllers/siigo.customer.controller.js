// customerController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment')

const getCustomer = async (req, res) => {
  let data = {}
  if (req.params.id == undefined) {
    try {
      const apiInstance = new  SiigoApi.CustomerApi()
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

      data = await apiInstance.getCustomers(opts)
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

const createCustomer = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'createCustomer works!'
  })
}

const updateCustomer = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'updateCustomer works!'
  })
}

const deleteCustomer = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'deleteCustomer works!'
  })
}

export { getCustomer, createCustomer, updateCustomer, deleteCustomer }