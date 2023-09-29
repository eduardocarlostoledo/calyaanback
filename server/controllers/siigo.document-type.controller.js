//import { SiigoApi } from "../controllers/siigo.auth.controller.js";
import * as SiigoApi from 'siigo_api';
const documentTypeApi = new SiigoApi.DocumentTypeApi();

async function obtenerTiposDocumentos(args) {
  try {
    const documentTypeApi = new SiigoApi.DocumentTypeApi();
    const opts = {
      type: args,
    };
    const response = await documentTypeApi.getDocumentTypes(opts);
    return response;
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error.status);
  }
}

const getDocumentType = async (req, res) => {
  try {
    console.log("getDocumentTypes", req.query);
    const opts = {
      type: req.query,
    };

    let apiInstance = new SiigoApi.DocumentTypeApi();
    const data = await apiInstance.getDocumentTypes(req.query);
    res.status(200).json({
      status: 'Ok',
      info: "Sin datos", 
      data: data,
    })
//    const response = obtenerTiposDocumentos(type);
    //res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
      error: error
    });
  }
}

export {
  getDocumentType
};



// import { SiigoApi } from "../controllers/siigo.auth.controller.js";
// //import * as SiigoApi from 'siigo_api';
// // Handle index actions
// //const environment = require('../config/environment')

// const getDocumentType = async (req, res) => {
//   try {
//     console.log("getDocumentTypes", req.query);
//     const { type } = req.query;

//     await SiigoApi.DocumentTypeApi;
//     let respuestaSiigoApi = SiigoApi.ApiClient.DocumentTypeApi.getDocumentTypes();
//     console.log("API called successfully. Returned response: " + respuestaSiigoApi);

//     let opts = {
//       type: type,
//     };
//     let response = SiigoApi.DocumentTypeApi.getDocumentTypes();
//     console.log("API called successfully. Returned response: " + response);

//     // const data = await apiInstance.getDocumentTypes(opts);
//     // console.log('API called successfully. Returned data: ' + data);
    
//     res.status(200).json(response)
//   } catch (error) {
//     res.json({
//       status: 'Error',
//       message: 'Something was wrong',
//       error: error
//     })
//   }
// }

// // ESTO ME TIRA DATA DE APICLIENT (URL TOKEN ETC PERO NADA MAS)
// // const getDocumentType = async (req, res) => {
// //   try {
// //     console.log("getDocumentTypes", req.query);
// //     const { type } = req.query;

// //     let apiInstance = new SiigoApi.DocumentTypeApi();
// //     let opts = {
// //       type: type // String | Represents the document type. For example, 'FV' to invoices, 'NC' to credit notes, or 'RC' to vouchers.
// //     };

// //     const data = await apiInstance.getDocumentTypes(opts);
// //     console.log('API called successfully. Returned data: ' + data);
    
// //     res.status(200).json(data)
// //   } catch (error) {
// //     res.json({
// //       status: 'Error',
// //       message: 'Something was wrong',
// //       error: error
// //     })
// //   }
// // }

// // //import * as SiigoApi from 'siigo_api';
// // import { SiigoApi } from "../controllers/siigo.auth.controller.js";

// // async function getDocumentType(){
// //   try {
// //     let apiInstance = await new SiigoApi.AccountGroupApi();
// //     const data = await apiInstance.getAccountGroups();
// //     console.log('API called successfully. Returned data: ' + data);
// //     return data;
// //   } catch (error) {
// //     console.error("error", error.message);
// //   }
// // }

// export {
//   getDocumentType}