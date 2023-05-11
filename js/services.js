import { Texts } from "./strings.js";

const NO_TOKEN = 'NO_TOKEN',
    // HOME_URL = './api/fakeapi.json',
    HOME_URL = 'https://dev.netalizer.com/GazpachoApi2/extEntity',
    ORG_ID = '4137',
    PROFILE_NAME = 'ticket_get';

const getTokenFromURL = () => {
    const hash = window.location.hash;
    if (hash !== '') { // if token is in path
        return hash.slice(1);
    } else { // if token is in parameter
        if (window.location.search) {
            return window.location.search.slice(3);
        } else {
            return NO_TOKEN;
        }
    }
}
const responseDataValidator = (data) => {
    switch (data?.code) {
        case undefined:
            return { message: Texts.Ok_code };
        case 1:
            return { message: Texts.ErrorCode_1 };
        case 2:
            return { message: Texts.ErrorCode_2 };
        case 3:
            return { message: Texts.ErrorCode_3 };
        default:
            return { message: Texts.ErrorCode_2 };
    }
}

const responseStatusValidator = (res) => {
    if (res?.ok) {
        return res;
    } else {
        return { code: 4, message: Texts.Err_res_not_ok };
    }
}

export async function getAttachments() {
    const token = getTokenFromURL();
    if (token === NO_TOKEN) {
        const code = { code: 2 };
        return { ...responseDataValidator(code), ...code };
    } else {
        try {
            const response = await fetch(
                `${HOME_URL}?orgId=${ORG_ID}&p=${PROFILE_NAME}&k=${token}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
    
            try {
                const data = await response?.json();
                return { ...data, ...responseDataValidator(data) };
            } catch (error) {
                if (!response?.ok) {
                    return responseStatusValidator(response);
                }
            }
        } catch (error) {
            return { code: 4, message: Texts.Err_res_not_ok };
        }
    }
}