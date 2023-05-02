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

export async function getAttachments() {
    // if (getTokenFromURL() === NO_TOKEN) {
    //     return {code: 2};
    // } else {
        return fetch("./api/fakeapi.json", {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then((data) => data.json());
    // }
}