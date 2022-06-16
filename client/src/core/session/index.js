import { CustomError } from 'core';
import Environment from 'environment';
import 'url-search-params-polyfill';

export const login = (username, password) => {
    let urlParams = new URLSearchParams();
    urlParams.append('grant_type','password')
    urlParams.append('username',username)
    
    let RSA = new window.JSEncrypt();
    RSA.setPublicKey(Environment.rsaKey);
    let encryptedPassword = RSA.encrypt(password).replace(/\n|\r/g, "");
    
    urlParams.append('password',encryptedPassword)

    return fetch(Environment.loginUrl, {
        body: urlParams.toString(),
        headers: {
            Accept: 'application/json',
            "Authorization": "Basic" + " " + Environment.clientIdSecret,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(handleResponse);
}

export const refreshSession = (refreshToken) => {
    
    let urlParams = new URLSearchParams();
    urlParams.append('grant_type','refresh_token')
    urlParams.append('refresh_token',refreshToken)
    
    return fetch(Environment.refreshSessionUrl, {
        body: urlParams.toString(),
        headers: {
            // Accept: 'application/json',
            "Authorization": "Basic" + " " + Environment.clientIdSecret,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(handleResponse)
}

const handleResponse = response => {
    console.log("Session Response:", response);

    const contentType = response.headers.get("content-type");

    if (response.status >= 200 && response.status < 300) {
        const isJSON = contentType && contentType.indexOf("application/json") !== -1
        return isJSON ? response.json() : response;
    } else if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(errorBody => {
            let error = new CustomError().networkError(errorBody.error_description || errorBody.error);
            error.response = errorBody;
            console.log("ErrorBody:", error.response)
            return Promise.reject(error);
        });
    } else {
        let error = new CustomError().networkError(response.statusText || response.status);
        error.response = response;
        return Promise.reject(error);
    }
}