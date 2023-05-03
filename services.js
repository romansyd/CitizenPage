const NO_TOKEN = 'NO_TOKEN';
const getTokenFromURL = () =>{
    const hash = window.location.hash;
    if (hash !== '') { // if token is in path
        return hash.slice(1);
    } else{ // if token is in parameter
        if (window.location.search) {
            return window.location.search.slice(3);
        } else {
            return NO_TOKEN;
        }
    }
}
const responseValidator = (data) => {
    switch (data?.code) {
        case undefined:
            return {message: 'OK'};
        case 1:
            return {message: 'Invalid Request'};
        case 2:
            return {message: 'Invalid Token'};
        case 3:
            return {message: 'Token Expired'};
        default:
            return {message: 'Invalid Request'};
    }
}

export async function getAttachments() {
    if (getTokenFromURL() === NO_TOKEN) {
        const code = {code: 2};
        return {...responseValidator(code), ...code};
    } else {
        const response = await fetch("./api/fakeapi.json", {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then((data) => data.json());
        return {...response, ...responseValidator(response)};
    }
}