let groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let userColors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];

/**
 * Is stored on the server under the key 'guestContacts'
 */
let allContacts;
let tasks;

async function initContacts() {
    await loadContactsAndTasksUserOrGuest();
    renderGroupLetters();
    addContactToGroup();
    loadColors();
    checkContactsInGroup();
    emptyContactList();
}

async function loadContactsAndTasksUserOrGuest() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
        let userEmail = localStorage.getItem('userEmail');
        userEmail = userEmail.replace(/"/g, '');
        users = JSON.parse(await getItem('users'));
        let user = users.find((u) => u.email === userEmail);
        if (user) {
            allContacts = JSON.parse(await getItem(`${user.email}_contacts`));        //  Hier wird das Kontakte-Array eines angemeldeten Users in der Variable 'allContacts' gespeichert
            tasks = JSON.parse(await getItem(`${user.email}_tasks`));
        }
    } else {
        allContacts = JSON.parse(await getItem('guestContacts'));                          //   Hier wird das Kontakte-Array eines Gasts in der Variable 'allContacts' gespeichert
        tasks = JSON.parse(await getItem(`guestTasks`));
    }
}

async function sendContactsToServer() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
        let userEmail = localStorage.getItem('userEmail');
        userEmail = userEmail.replace(/"/g, '');
        let user = users.find((u) => u.email == userEmail);
        if (user) {
            await setItem(`${user.email}_contacts`, JSON.stringify(allContacts));
            await setItem(`${user.email}_tasks`, JSON.stringify(tasks));
        }
    } else {
        await setItem('guestContacts', JSON.stringify(allContacts));
        await setItem('guestTasks', JSON.stringify(tasks));
    }
    await initContacts();
}

function renderGroupLetters() {
    document.getElementById('contact_list').innerHTML = '';
    for (let i = 0; i < groups.length; i++) {
        const letter = groups[i];
        document.getElementById('contact_list').innerHTML += groupsTemplate(letter);
    }
}

function emptyContactList() {
    if (allContacts == '') {
        document.getElementById('contact_list').innerHTML = '<h1 style="text-align: center; margin-top: 120px ;">No contacts added yet. Add some!</h1>'
    }
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
        initials += name[j][0];
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

function showEditFormWhenWrong(i) {
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

async function addNewContact() {
    if (pushNewContact()) {
        hideAddForm();
        await sendContactsToServer();
        resetAddNewContactValues();
        showNewContact();
        createdContactAnimation();
    } else {
        renderAlert('alert_container', 'alert_content', 'Contact with this e-mail already exists!');
    }

}

function showNewContact() {
    let id = allContacts.length - 1;
    showContactInfo(`${id}`);
    document.getElementById(`${id}`).focus();
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
    if (allContacts.some(item => item.e_mail === inputEMail)) {
        let i = allContacts.findIndex(function (item, i) {
            return item.e_mail === inputEMail;
        });
        showEditFormWhenWrong(i);
        return false;
    } else {
        allContacts.push(
            {
                name: inputName,
                e_mail: inputEMail,
                phone: inputPhone,
                color: color
            }
        );
        return true;
    }
}

async function saveContactChanges(i) {
    updateContact(i);
    hideAddForm();
    await sendContactsToServer();
    showContactInfo(i);
    document.getElementById(i).focus();
}

function updateContact(i) {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    allContacts[i]['name'] = inputName;
    allContacts[i]['e_mail'] = inputEMail;
    allContacts[i]['phone'] = inputPhone;
    updateCurrentContactsInTasks();
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

async function deleteAnUser() {
    let index = currentContactIndex();
    allContacts.splice(index, 1);
    updateCurrentContactsInTasks();
    await sendContactsToServer();
    hideContactInfo();
}

function currentContactIndex() {
    let contactHTML = document.getElementById('contact_details').getElementsByTagName('div');
    let elementId = contactHTML[1].getAttribute('id');
    let sliceFrom = elementId.lastIndexOf('_') + 1;
    let index = elementId.slice(sliceFrom);
    return index;
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function updateCurrentContactsInTasks() {
    for (let i = 0; i < tasks.length; i++) {
        const updatedArray = tasks[i]['current_contacts'].filter(obj1 =>
            allContacts.some(obj2 =>
                obj2.name === obj1.name &&
                obj2.e_mail === obj1.e_mail &&
                obj2.phone === obj1.phone &&
                obj2.color === obj1.color
            )
        );
    
        // Aktualisiere array1 mit den gefilterten Objekten
        tasks[i]['current_contacts'].length = 0;
        Array.prototype.push.apply(tasks[i]['current_contacts'], updatedArray);
    }
}