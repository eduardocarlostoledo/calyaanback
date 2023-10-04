// customerController.js
// Import user model
 import * as SiigoApi from 'siigo_api';
 import axios from 'axios';
 import { getAccessToken } from '../helpers/siigoAccessToken.js';
import { json } from 'express';
// Handle index actions
//const environment = require('../config/environment')

const getAllCustomersSiigo = async (req, res) => {
  try {
    const apiInstance = new SiigoApi.CustomerApi();
    const opts = {
      identification: req.body.identification,
      branchOffice: req.body.branchOffice,
      active: req.body.active,
      type: req.body.type,
      personType: req.body.personType,
      createdStart: req.body.createdStart,
      createdEnd: req.body.createdEnd,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd, // Corregido, debe ser dateEnd: req.body.dateEnd
      updatedStart: req.body.updatedStart,
      updatedEnd: req.body.updatedEnd,
      page: req.body.page,
      pageSize: req.body.pageSize
    };
    
    //const data = await apiInstance.getCustomers(opts);
    const data = await axios.get('https://api.siigo.com/v1/customers', {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      params: opts
    });
    res.status(200).json(data.data);
    
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    });
  }
};

const getCustomerByIdSiigo = async (req, res) => {
  try {
    const apiInstance = new SiigoApi.CustomerApi();
    const id = req.params.id;

    const data = await apiInstance.getCustomer(id);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: 'Error',
      message: 'Something was wrong',
      error: error
    });
  }
};

const createCustomerSiigo = async (req, res) => {
  try {
    const opts = {
      personType: req.body.person_type,
      idType: req.body.id_type,
      identification: req.body.identification,
      name: req.body.name,
      address: req.body.address,
      phones: req.body.phones,
      contacts: req.body.contacts,
    };
    
    const data = await axios.get('https://api.siigo.com/v1/customers', {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      body: opts
    });    

    res.status(200).json({
      status: 'success',
      message: 'Customer created successfully!',
      data: data
    });
  } catch (error) {
    console.error('Error creating customer:', error);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error.message
    });
  }
}

// const createCustomerSiigo = async (req, res) => {
//   try {
//     const apiInstance = new SiigoApi.CustomerApi();
// const opts = {
//   type: req.body.type,
//   personType: req.body.person_type,
//   identification: req.body.identification,
//   name: [
//     req.body.name
//   ],
//   address: { 
//     address: req.body.address.address,
//     city: {
//       country_code: req.body.address.city.country_code,
//       state_code: req.body.address.city.state_code,
//       city_code: req.body.address.city.city_code,    
//     },
//   },
//   phones: [{
//     number : req.body.phones
//   }],
//   contacts: [
//     {
//         first_name: req.body.contacts.first_name,
//         last_name: req.body.contacts.last_name,
//         email: req.body.contacts.email,
//     }
// ]
// };
//     const data = await apiInstance.getCustomers(opts);
    
//     res.status(200).json({
//       status: 'success',
//       message: 'createCustomer works!',
//       data: data
//     })  
//   } catch (error) {
//     res.json({
//       status: 'Error',
//       message: 'Something was wrong',
//       error: error
//     });
//   }
  
// }

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

export { getAllCustomersSiigo, getCustomerByIdSiigo,  createCustomerSiigo, updateCustomerSiigo, deleteCustomerSiigo }