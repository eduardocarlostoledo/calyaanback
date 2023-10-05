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
      data: data.data
    });
  } catch (error) {

    if (error.response && error.response.data) {
      console.error('Error Status:', error.response.data.Status);
      console.error('Errors:', error.response.data.Errors);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
    // res.status(500).json({
    //   status: 'error',
    //   message: 'Something went wrong',
    //   error: error.message
    // });
  }
}

const updateCustomerSiigo = async (req, res) => {
  try {
    let apiInstance = new SiigoApi.CustomerApi();
    const id = req.params.id;

    const opts = {      
      type: req.body.type,
      person_type: req.body.person_type,
      id_type: req.body.id_type,
      identification: req.body.identification,
      name: req.body.name,
      commercial_name: req.body.commercial_name,
      address: req.body.address,
      phones: req.body.phones,
      contacts: req.body.contacts,
      comments: req.body.comments,
      related_users: req.body.related_users,
      custom_fields: req.body.custom_fields,      
    };
console.log("OPTIONS UPDATE CUSTOMER", id, opts)
const data = await apiInstance.updateCustomer(id, opts);
    // const data = await axios.put(`https://api.siigo.com/v1/customers/${id}`, opts, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${getAccessToken()}`,
    //     'Partner-Id': "calyaanapp",
    //   }
    // });
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Customer updated successfully!',
    //   data: data.data // El resultado de la solicitud put debe estar en data.data
    // });
    res.status(200).json(data);
  } catch (error) {
    console.log("ERROR UPDATE CUSTOMER", error)
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
}

const deleteCustomerSiigo = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'deleteCustomer works!'
  })
}

export { getAllCustomersSiigo, getCustomerByIdSiigo,  createCustomerSiigo, updateCustomerSiigo, deleteCustomerSiigo }