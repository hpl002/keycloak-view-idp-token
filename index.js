// get keycloak access token for user
const axios = require("axios")
const qs = require('qs');
const jwt_decode = require('jwt-decode');

const getAccessToken = async () => {
    let config = {
        method: 'post',
        url: process.env.KEYCLOAK_ACCESS_TOKEN_URL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            'client_id': process.env.KEYCLOAK_CLIENT_ID,
            'username': process.env.KEYCLOAK_USERNAME,
            'password': process.env.KEYCLOAK_PASSWORD,
            'grant_type': 'password'
        })
    };
    const response = await axios(config)
    return response.data.access_token
};

const getIDPToken = async (accessToken) => {
    let config = {
        method: 'get',
        url: process.env.KEYCLOAK_IDP_TOKEN_URL,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const response = await axios(config)
    // console.log("idp_token", response.data)
    return response.data
}

(async () => {
    // keycloak access token
    const access_token = await getAccessToken()
    //console.log(jwt_decode(access_token))

    // azure tokens
    const idp_token = await getIDPToken(access_token)
    console.log("idp response", idp_token)
    console.log("decoded idp id_token", jwt_decode(idp_token.id_token))
})()
