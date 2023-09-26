import * as SiigoApi from 'siigo_api';
// Handle index actions
//const environment = require('../config/environment') //implementar luego



const siigoLogin = async (req, res) => {
  if (!req.body.username || !req.body.access_key) 
  { res.status(400).send('Error: Incomplete Data') }
 //  if (!environment.path.api || !environment.path.sign) 
 //{ res.status(400).send('Error: Configure Environment') } // implementar luego
  
 try {
    const { username, access_key } = req.body;
    console.log("ACCESS", username, access_key);
// initial configuration for the SDK  

// luego para definir los enviroments
// SiigoApi.initialize({
//   basePath: environment.path.api,
//   urlSignIn: environment.path.sign
// })

SiigoApi.initialize({
    basePath: "https://services.siigo.com/alliances/api",  // 
    urlSignIn: "https://services.siigo.com/alliances/api/siigoapi-users/v1/sign-in",       // 
  });

    // sign in to get the token
    await SiigoApi.signIn({
        userName: username, // string | Username
        accessKey: access_key, // string | Access key 
    })
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



const AccountGroupApi = async (req, res) => {    
    console.log("AccountGroupApi", req.body);
  try {
// configuration for the SDK  
let apiInstance = new SiigoApi.AccountGroupApi();
console.log("apiInstance", apiInstance);
const data = await apiInstance.getAccountGroups();
console.log('API called successfully. Returned data: ' + data);

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

export { siigoLogin, AccountGroupApi, SiigoApi };



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