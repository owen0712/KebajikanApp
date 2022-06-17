import { CustomError } from 'core';
import sha256 from 'crypto-js/sha256';
import Environment from '../../environment';

export const postData = (url, params, secure = false, customAccessToken = '') => {
    return fetch(url, {
        method: 'POST',
        headers: secure ? getSecureHeader(customAccessToken,params) : getHeader(),
        body: JSON.stringify(params)
    }).then(handleResponse);
}

export const postFile = (url, params, secure = false, customAccessToken = '') => {
    return fetch(url, {
        method: 'POST',
        headers: secure ? getSecureHeader(customAccessToken,params, true) : getHeader(),
        body: params
    }).then(handleResponse);
}

export const getData = (url, secure = false, customAccessToken = '') => {

    return fetch(url, {
        method: 'GET',
        headers: secure ? getSecureHeader(customAccessToken) : getHeader(),
    }).then(handleResponse);
}
 
export const putData = (url, params, secure = false, customAccessToken = '') => {
    return fetch(url, {
        method: 'PUT',
        headers: secure ? getSecureHeader(customAccessToken,params) : getHeader(),
        body: JSON.stringify(params)
    }).then(handleResponse);
}

export const patchData = (url, params, secure = false, customAccessToken = '') => {
    return fetch(url, {
        method: 'PATCH',
        headers: secure ? getSecureHeader(customAccessToken,params) : getHeader(),
        body: JSON.stringify(params)
    }).then(handleResponse);
}

export const deleteData = (url, params, secure = false, customAccessToken = '') => {
    return fetch(url, {
        method: 'DELETE',
        headers: secure ? getSecureHeader(customAccessToken,params) : getHeader(),
        body: JSON.stringify(params)
    }).then(handleResponse);
}

const getSecureHeader = (customAccessToken, params, isFileContentType = false) => {

    let HSParams = undefined;
    if(params){
        var RSA = new window.JSEncrypt();
        RSA.setPublicKey(Environment.rsaKey);
        HSParams = RSA.encrypt(sha256(JSON.stringify(params)).toString())
        HSParams = HSParams.replace(/\n|\r/g, "");
    }

    if (customAccessToken !== '' && customAccessToken !== null && customAccessToken !== undefined)
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + customAccessToken,
            ...HSParams&&{'DBOS-HS':HSParams}
        }

    const accessToken = sessionStorage.getItem('dbos:scenter-web:accessToken');

    if (isFileContentType) {
        return {
            Accept: 'application/json',
            "Authorization": "Bearer " + accessToken,
            ...HSParams&&{'DBOS-HS':HSParams}
        }
    } else {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + accessToken,
            ...HSParams&&{'DBOS-HS':HSParams}
        }
    }
}

const getHeader = () => {
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'basicdHJ1c3RlZENsaWVudDo0Yzg1YzRmYy1jNTJkLTRjZTYtYTgzZi02ZTBhN2M3Y2Q0NDE='
    }
}

const handleResponse = response => {
    console.log("Response:", response);

    const contentType = response.headers.get("content-type");
    
    if (response.status >= 200 && response.status < 300) {
        const isJSON = contentType && contentType.indexOf("application/json") !== -1;

        // Special handling to retrieve response headers
        if (response.headers.get("X-Total-Count")) {
            return response;
        } else {
            return isJSON ? response.json() : response;
        }
    } else if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(errorBody => {
            let error = new CustomError().networkError(errorBody.error);
            error.response = errorBody;
            console.log("ErrorBody:", error.response);
            return Promise.reject(error);
        });
    } else {
        let error = new CustomError().networkError(response.statusText || response.status);
        error.response = response;
        return Promise.reject(error);
    }
 }