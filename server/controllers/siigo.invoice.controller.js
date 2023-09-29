// invoiceController.js
// Import user model
import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require("../config/environment");

const createInvoiceSiigo = async function (req, res) {
  try {

  const opts = {
    document: {
      id: req.body.document.id
    },
    date: req.body.date,
    customer: {
      identification: req.body.customer.identification,
      branch_office: req.body.customer.branch_office
    },
    seller: req.body.seller,
    items: req.body.items,
    payments: req.body.payments
  };
  
    const apiInstance = new SiigoApi.InvoiceApi();

    const data = await apiInstance.createInvoice(opts);
    res.status(201).json(data);
  } catch (error) {
    res.json({
      status: "Error",
      message: "Something was wrong",
      error: error
    });
  }
};

const getInvoiceSiigo = async (req, res) => {
  if (req.params.id == undefined) {
    try {
      const apiInstance = new  SiigoApi.InvoiceApi();
      const opts = {
        documentId: req.body.documentId,
        customerIdentification: req.body.customerIdentification,
        customerBranchOffice: req.body.customerBranchOffice,
        name: req.body.name,
        createdStart: req.body.createdStart,
        createdEnd: req.body.createdEnd,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        updatedStart: req.body.updatedStart,
        updatedEnd: req.body.updatedEnd,
        page: req.body.page || 1,
        pageSize: req.body.pageSize || 25
      };

      const data = await apiInstance.getInvoices(opts);
      res.status(200).json(data);
    } catch (error) {
      res.json({
        status: "Error",
        message: "Something was wrong",
        error: error
      });
    }
  } else {
    try {
      const apiInstance = new  SiigoApi.InvoiceApi();
      const id = req.params.id;

      const data = await apiInstance.getInvoice(id);
      res.status(200).json(data);
    } catch (error) {
      res.json({
        status: "Error",
        message: "Something was wrong",
        error: error
      });
    }
  }
};

const getInvoicePDFSiigo = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.InvoiceApi();
    const id = req.params.id;
    const data = await apiInstance.getInvoicePDF(id);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: "Error",
      message: "Something was wrong",
      error: error
    });
  }
};

const getElectronicInvoiceErrorsSiigo = async (req, res) => {
  try {
    const apiInstance = new  SiigoApi.InvoiceApi();
    const id = req.params.id;
    const data = await apiInstance.getElectronicInvoiceErrors(id);
    res.status(200).json(data);
  } catch (error) {
    res.json({
      status: "Error",
      message: "Something was wrong",
      error: error
    });
  }
};

export { createInvoiceSiigo, getInvoiceSiigo, getInvoicePDFSiigo, getElectronicInvoiceErrorsSiigo };