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
      person_type: req.body.person_type,
      id_type: req.body.id_type,
      identification: req.body.identification,
      name: req.body.name,
      address: req.body.address,
      phones: req.body.phones,
      contacts: req.body.contacts,
      comments: req.body.comments,
      related_users: req.body.related_users,
      type: req.body.type
    };
console.log("OPTIONS CREATE CUSTOMER", opts)
    // Cambia axios.get a axios.post y asegúrate de especificar la URL correcta para crear un cliente.
    const data = await axios.post('https://api.siigo.com/v1/customers', opts, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
        'Partner-Id': "calyaanapp",
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Customer created successfully!',
      data: data.data // El resultado de la solicitud POST debe estar en data.data
    });
  } catch (error) {

    if (error.response && error.response.data) {
      // If the error response contains 'data' with 'Status' and 'Errors'
      console.error('Error Status:', error.response.data.Status);
      console.error('Errors:', error.response.data.Errors);
      res.status(error.response.status).json(error.response.data);
    } else {
      // If there's no specific error response structure, log a general error
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }

    // console.error('Error creating customer:', error);

    // res.status(500).json({
    //   status: 'error',
    //   message: 'Something went wrong',
    //   error: error.message
    // });
  }
}

// const createCustomerSiigo = async (req, res) => {
//   try {
//     const opts = {
//       type: req.body.type,
//       personType: req.body.person_type,
//       idType: req.body.id_type,
//       identification: req.body.identification,
//       name: req.body.name,
//       address: req.body.address,
//       phones: req.body.phones,
//       contacts: req.body.contacts,
//       comments: req.body.comments,
//       related_users: req.body.related_users
//     };
    
//     let newOpts=JSON.stringify(opts)
//     console.log("OPTIONS CREATE CUSTOMER", newOpts)

//     const data = await axios.post('https://api.siigo.com/v1/customers', {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`
//       },
//       body: newOpts
//     });    

//     res.status(200).json({
//       status: 'success',
//       message: 'Customer created successfully!',
//       data: data
//     });
//   } catch (error) {
//     console.error('Error creating customer:', error);

//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong',
//       error: error.message
//     });
//   }
// }

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