function addGroups() {
    for (let i = 0; i < groups.length; i++) {
        const letter = groups[i];
        document.getElementById('contact_list').innerHTML += groupsTemplate(letter);
    }
    addContactToGroup();
    loadColors();
    checkContactsInGroup();
}

function checkContactsInGroup() {
    for (let i = 0; i < groups.length; i++) {
        const letter = groups[i];
        let contact = document.getElementById('contacts' + letter);
        if (contact.innerHTML == '') {
            document.getElementById('group' + letter).classList.add('d-none')
        }
    }
}

function addContactToGroup() {
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['name'];
        let firstLetter = name.slice(0, 1);
        document.getElementById('contacts' + firstLetter).innerHTML += addContactToGroupTemplate(name, i);
    }
}

function loadInitials(i) {
    let name = contacts[i]['name'];
    let initials = name[0];
    for (let j = 0; j < name.length; j++) {
        let spaceIndex = name.indexOf(' ', j);
        if (spaceIndex == -1) {
            break
        } else {
            initials += name[spaceIndex + 1];
            j = spaceIndex;
        }
    }
    return initials;
}

function loadColors() {
    for (let i = 0; i < contacts.length; i++) {
        const color = contacts[i]['color'];
        document.getElementById("initials" + i).style.backgroundColor = color;
    }
}

function hideContactInfo() {
    document.getElementById('contacts').style.display = 'none';
    document.getElementById('edit_contact_button').style.display = 'none';
    document.getElementById('contact_details').style.display = 'none';
}

function showContactInfo(i) {
    document.getElementById('contacts').style.display = 'block';
    document.getElementById('edit_contact_button').style.display = 'block';
    document.getElementById('contact_details').style.display = 'flex';
    document.getElementById('contact_details').classList.add('slide-in');
    document.getElementById('contact_details').innerHTML = contactInfoTemplate(i);
    let color = document.getElementById("initials" + i).style.backgroundColor;
    document.getElementById("color_large" + i).style.backgroundColor = color;
}

