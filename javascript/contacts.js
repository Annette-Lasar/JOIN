function addGroups() {
    document.getElementById('contact_list').innerHTML = '';
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

function hideAddForm() {
    document.getElementById('background').classList.remove('fade-in');
    document.getElementById('add_form').classList.remove('slide-in');
    document.getElementById('add_form').classList.add('slide-out');
    document.getElementById('background').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('add_new_contact').style.display = 'none';
    }, 500);
}

function showAddForm() {
    document.getElementById('add_new_contact').style.display = 'flex';
    document.getElementById('add_form').classList.remove('slide-out');
    document.getElementById('background').classList.remove('fade-out');
    document.getElementById('background').classList.add('fade-in');
    document.getElementById('add_form').classList.add('slide-in');
}

function randomUserColor() {
    let random = Math.floor(Math.random() * userColors.length);
    let randomColor = userColors[random];
    return randomColor
}

function addNewContact() {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    let color = randomUserColor();
    contacts.push(
        {
            "name": inputName,
            "e-mail": inputEMail,
            "phone": inputPhone,
            "color": color
        }
    );
    hideAddForm();
    addGroups();
    resetAddNewContactValues();
}

function resetAddNewContactValues() {
    document.getElementById('add_name').value = '';
    document.getElementById('add_email').value = '';
    document.getElementById('add_phone').value = '';
}

function showEdit() {
    document.getElementById('empty').style.display = 'block';
    document.getElementById('edit_delete').classList.remove('slide-out-edit');
    document.getElementById('edit_delete').classList.add('slide-in-edit');
}

function hideEdit() {
    document.getElementById('edit_delete').classList.remove('slide-in-edit');
    document.getElementById('edit_delete').classList.add('slide-out-edit');
    setTimeout(() => {
        document.getElementById('empty').style.display = 'none';
    }, 300);
}

function deleteAnUser() {
    let userId = document.getElementById('contact_details').innerHTML;
    console.log(userId);
}