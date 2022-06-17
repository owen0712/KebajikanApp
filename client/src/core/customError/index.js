export default class CustomError {
    
    refreshTokenExpired() {
        let error = new Error('Your session has timed-out. Please sign-in again.');
        error.name = 'RefreshTokenExpired';
        return error;
    }

    loginError(message) {
        let error = new Error(message);
        error.name = "LoginError";
        return error;
    }

    networkError(message) {
        let error = new Error(message);
        error.name = "NetworkError";
        return error;
    }
}