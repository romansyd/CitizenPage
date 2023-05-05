import { Texts } from "./strings.js";

const NO_TOKEN = 'NO_TOKEN',
    HOME_URL = './api/fakeapi.json',
    ORG_ID = '123',
    PROFILE_NAME = 'name';

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
const responseValidator = (data) => {
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
    if (res.ok) {
        return res;
    } else {
        return { code: 4, message: Texts.Err_res_not_ok }
    }
}

export async function getAttachments() {
    const token = getTokenFromURL();
    if (token === NO_TOKEN) {
        const code = { code: 2 };
        return { ...responseValidator(code), ...code };
    } else {
        const response = await fetch(
            `${HOME_URL}?orgId=${ORG_ID}?p=${PROFILE_NAME}?k=${token}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

        if (!response.ok) {
            return responseStatusValidator(response);
        }

        const data = await response.json();
        return { ...data, ...responseValidator(data) };
    }
}