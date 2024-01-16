const STORAGE_TOKEN = 'WD1QPQKHI4MOS1DQJR4CO2CZ2PYLN9D1ZQY7FT1H';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * 
 * @param {String} key - This key is stored on the server to retrieve arrays from the server in the future
 * @param {Array} value - This value contains an array, either with users, contacts, or tasks, to be saved on the server
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}


/**
 * 
 * @param {String} key - This is the name of the key we previously stored on the server to be able to save arrays on the server
 * @returns {Response} - The server's response
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw 'key not found!';
    });
}
