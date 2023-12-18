function groupsTemplate(letter) {
    return `
    <div id="group${letter}">
        <div class="group">
            <h1>${letter}</h1>
        </div>
        <div class="separator">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 354 2" fill="none">
                <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round" stroke-width="1px" />
            </svg>
        </div>
        <div id="contacts${letter}"></div>
    </div>
`
}

function addContactToGroupTemplate(name, i) {
    let eMail = contacts[i]['e-mail'];
    let initials = loadInitials(i);
    return `
        <div id="${i}" class="contact">
            <div id="initials${i}" class="initials">
              <h3>${initials}</h3>
            </div>
            <div class="contact-info">
              <h1>${name}</h1>
              <p>${eMail}</p>
            </div>
        </div>
    `
}