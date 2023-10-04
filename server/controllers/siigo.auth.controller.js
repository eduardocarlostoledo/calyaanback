import * as SiigoApi from 'siigo_api';
import { setAccessToken } from '../helpers/siigoAccessToken.js';
// Handle index actions
//const environment = require('../config/environment') //implementar luego

// initial configuration for the SDK  PRODUCTION
// SiigoApi.initialize({
//   basePath: "https://services.siigo.com/alliances/api",  // 
//   urlSignIn: "https://services.siigo.com/alliances/api/siigoapi-users/v1/sign-in",       // 
// });

// //MOCK SERVER RESPONDE PERO CON ERRORES
// SiigoApi.initialize({
//   basePath: "https://private-anon-1dcd13dadd-siigoapi.apiary-mock.com/v1",  // 
//   urlSignIn: "https://private-anon-1dcd13dadd-siigoapi.apiary-mock.com/auth",       // 
// });

//MOCK SERVER RESPONDE PERO CON ERRORES
SiigoApi.initialize({
  basePath: "https://api.siigo.com/",  // 
  urlSignIn: "https://api.siigo.com/auth",       // 
});

const siigoLogin = async (req, res) => {
  if (!req.body.username || !req.body.access_key) { res.status(400).send('Error: Incomplete Data') }
  try {
    const { username, access_key } = req.body;
    console.log("ACCESS", username, access_key);


    // Iniciar sesión para obtener el token
    await SiigoApi.signIn({
      userName: username,
      accessKey: access_key,
    });
    //console.log("SiigoApi.ApiClient.instance", SiigoApi.ApiClient.instance);
    let response = SiigoApi.ApiClient.instance.accessToken
    // Verificar si se obtuvo el token de acceso correctamente
    if (response) {
      // Almacena el token de acceso en el módulo
      setAccessToken(response);
      console.log("SIIGO LOGIN", "setAccessToken");
    }


    res.status(200).json({
      access_token: SiigoApi.ApiClient.instance.accessToken,
      expires_in: SiigoApi.ApiClient.instance.timeout,
      token_type: SiigoApi.ApiClient.instance.authentications.Bearer.type,
      scope: "SiigoAPI"

    })
  } catch (error) {
    res.json({
      status: 'error',
      message: {
        Authentication: 'Authentication failed',
        error: error
      }
    })
  }
}



const AccountGroup = async (req, res) => {
  try {
    // configuration for the SDK  
    let apiInstance = new SiigoApi.AccountGroupApi();
    //console.log("apiInstance", apiInstance);
    //const data = await apiInstance;
    const data = await apiInstance.getAccountGroups();
    console.log('API called successfully. Returned data: ' + data);

    // configuration for the SDK  

    res.status(200).json(data)
  } catch (error) {
    res.json({
      status: 'Error',
      message: {
        error: error
      }
    })
  }
}

export { siigoLogin, AccountGroup, SiigoApi };



/* modelito

  const FUNCTION = async (req, res) => {    
    console.log("FUNCTION", req.body);
  try {
// configuration for the SDK  

// configuration for the SDK  
    res.status(200).json({
        status: 'success',
        data: { Authentication: 'Authentication Successfully' }
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: {
          Authentication: 'Authentication failed',
          error: error
        }
      })
    }
  }

*/