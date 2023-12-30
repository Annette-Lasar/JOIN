const STORAGE_TOKEN = 'WD1QPQKHI4MOS1DQJR4CO2CZ2PYLN9D1ZQY7FT1H';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


// Daten an Backend-Server senden
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}


// Daten von Backend-Server abrufen
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}
