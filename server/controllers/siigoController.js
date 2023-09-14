import * as SiigoApi from 'siigo_api';

const siigoLogin = async (req, res) => {
    const { username, access_key } = req.body;
    console.log("ACCESS", username, access_key);
  try {


// initial configuration for the SDK  
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



//   async function main(){
//     try {
//       let apiInstance = new SiigoApi.AccountGroupApi();
//       const data = await apiInstance.getAccountGroups();
//       console.log('API called successfully. Returned data: ' + data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

export { siigoLogin };