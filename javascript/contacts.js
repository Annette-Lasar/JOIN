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
    for (let i = 0; i < allContacts.length; i++) {
        let name = allContacts[i]['name'];
        let firstLetter = name.slice(0, 1);
        document.getElementById('contacts' + firstLetter).innerHTML += addContactToGroupTemplate(name, i);
    }
}

function loadInitials(i) {
    let name = allContacts[i]['name'].split(' ');
    let initials = '';
    for (let j = 0; j < name.length; j++) {
        initials += name[j][0]
    }
    return initials;
}

function loadColors() {
    for (let i = 0; i < allContacts.length; i++) {
        const color = allContacts[i]['color'];
        document.getElementById("initials" + i).style.backgroundColor = color;
    }
}

function hideContactInfo() {
    document.getElementById('contacts').style.display = 'none';
    document.getElementById('edit_contact_button').style.display = 'none';
    document.getElementById('contact_details').style.display = 'none';
}

function showContactInfo(i) {
    setTimeout(() => {
        document.getElementById('contact_details').classList.remove('slide-in');
    }, 200);
    document.getElementById('contacts').style.display = 'block';
    document.getElementById('edit_contact_button').style.display = 'block';
    document.getElementById('contact_details').style.display = 'flex';
    document.getElementById('contact_details').classList.add('slide-in');
    document.getElementById('contact_details').innerHTML = contactInfoTemplate(i);
    let color = document.getElementById("initials" + i).style.backgroundColor;
    document.getElementById("color_large_" + i).style.backgroundColor = color;
}

function hideAddForm() {
    document.getElementById('background').classList.remove('fade-in');
    document.getElementById('add_form').classList.remove('slide-in');
    document.getElementById('add_form').classList.add('slide-out');
    document.getElementById('background').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('contact_form').style.display = 'none';
    }, 500);
}

function showAddForm() {
    document.getElementById('contact_form').innerHTML = addNewContactFormTemplate();
    formAnimation();
}

function showEditForm() {
    let i = currentContactIndex();
    document.getElementById('contact_form').innerHTML = editContactFormTemplate(i);
    loadContactValues(i);
    formAnimation();
}

function formAnimation() {
    document.getElementById('contact_form').style.display = 'flex';
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
    pushNewContact();
    hideAddForm();
    addGroups();
    resetAddNewContactValues();
    document.getElementById(allContacts.length - 1).focus();
    showContactInfo(allContacts.length - 1);
    createdContactAnimation();
}

function createdContactAnimation() {
    setTimeout(() => {
        document.getElementById('contact_created').style.display = 'block';
        document.getElementById('contact_created').classList.add('slide-in');
    }, 300);
    setTimeout(() => {
        document.getElementById('contact_created').classList.add('slide-out');
    }, 1300);
    setTimeout(() => {
        document.getElementById('contact_created').classList.remove('slide-in');
        document.getElementById('contact_created').classList.remove('slide-out');
        document.getElementById('contact_created').style.display = 'none';
    }, 1400);
}

function pushNewContact() {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    let color = randomUserColor();
    allContacts.push(
        {
            name: inputName,
            e_mail: inputEMail,
            phone: inputPhone,
            color: color
        }
    );
}

function saveContactChanges(i) {
    updateContact(i);
    hideAddForm();
    addGroups();
    document.getElementById(i).focus();
    showContactInfo(i);
}

function updateContact(i) {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    let color = randomUserColor();
    allContacts[i]['name'] = inputName;
    allContacts[i]['e_mail'] = inputEMail;
    allContacts[i]['phone'] = inputPhone;
    allContacts[i]['color'] = color;
}

function loadContactValues(i) {
    document.getElementById('add_name').value = allContacts[i]['name'];
    document.getElementById('add_email').value = allContacts[i]['e_mail'];
    document.getElementById('add_phone').value = allContacts[i]['phone'];
}

function resetAddNewContactValues() {
    document.getElementById('add_name').value = '';
    document.getElementById('add_email').value = '';
    document.getElementById('add_phone').value = '';
}

function showOptions() {
    document.getElementById('empty').style.display = 'block';
    document.getElementById('edit_delete').classList.remove('slide-out-edit');
    document.getElementById('edit_delete').classList.add('slide-in-edit');
}

function hideOptions() {
    document.getElementById('edit_delete').classList.remove('slide-in-edit');
    document.getElementById('edit_delete').classList.add('slide-out-edit');
    setTimeout(() => {
        document.getElementById('empty').style.display = 'none';
    }, 300);
}

function deleteAnUser() {
    let index = currentContactIndex();
    allContacts.splice(index, 1);
    addGroups();
    hideContactInfo();
}

function currentContactIndex() {
    let contactHTML = document.getElementById('contact_details').getElementsByTagName('div');
    let elementId = contactHTML[1].getAttribute('id');
    let sliceFrom = elementId.lastIndexOf('_') + 1;
    let index = elementId.slice(sliceFrom);
    return index;
}