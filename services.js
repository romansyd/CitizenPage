export async function getAttachments() {
    return fetch("./api/fakeapi.json", {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then((data) => data.json());
}