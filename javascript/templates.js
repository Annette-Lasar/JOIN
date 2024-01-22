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
  let eMail = allContacts[i]['e_mail'];
  let initials = loadInitials(i);
  return `
        <button id="${i}" onclick="showContactInfo(${i})"class="contact">
            <div id="initials${i}" class="initials">
              <span>${initials}</span>
            </div>
            <div class="contact-info">
              <h1>${name}</h1>
              <p>${eMail}</p>
            </div>
        </button>
    `
}

function contactInfoTemplate(i) {
  let name = allContacts[i]['name'];
  let phone = allContacts[i]['phone'];
  let eMail = allContacts[i]['e_mail'];
  let initials = loadInitials(i);
  return `
        <div class="name">
          <div id="color_large_${i}" class="initials large">
            <span>${initials}</span>
          </div>
          <div class="contact-info">
            <h3>${name}</h3>
            <div class="icons">
              <div class="icon" onclick="showEditForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <mask id="mask0_114296_1661" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                    height="24">
                    <rect width="24" height="24" />
                  </mask>
                  <g mask="url(#mask0_114296_1661)">
                    <path
                      d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
                  </g>
                </svg>
                Edit
              </div>
              <div class="icon" onclick="deleteAnUser()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <mask id="mask0_114296_4124" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                    height="24">
                    <rect width="24" height="24" />
                  </mask>
                  <g mask="url(#mask0_114296_4124)">
                    <path
                      d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" />
                  </g>
                </svg>
                Delete
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2>Contact Information</h2>
        </div>
        <div class="info">
          <div class="info-sub">
            <b>Email</b>
            <a href="mailto:">${eMail}</a>
          </div>
          <div class="info-sub">
            <b>Phone</b>
            <p>${phone}</p>
          </div>
        </div>
    `
}

function addNewContactFormTemplate() {
  return `
    <div id="background" class="background" onclick="hideAddForm()"></div>
    <div id="add_form" class="add-form">
      <svg onclick="hideAddForm()" class="close-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
        <mask id="mask0_114296_3949" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
          height="24">
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_114296_3949)">
          <path
            d="M11.9998 13.4L7.0998 18.3C6.91647 18.4834 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4834 5.6998 18.3C5.51647 18.1167 5.4248 17.8834 5.4248 17.6C5.4248 17.3167 5.51647 17.0834 5.6998 16.9L10.5998 12L5.6998 7.10005C5.51647 6.91672 5.4248 6.68338 5.4248 6.40005C5.4248 6.11672 5.51647 5.88338 5.6998 5.70005C5.88314 5.51672 6.11647 5.42505 6.3998 5.42505C6.68314 5.42505 6.91647 5.51672 7.0998 5.70005L11.9998 10.6L16.8998 5.70005C17.0831 5.51672 17.3165 5.42505 17.5998 5.42505C17.8831 5.42505 18.1165 5.51672 18.2998 5.70005C18.4831 5.88338 18.5748 6.11672 18.5748 6.40005C18.5748 6.68338 18.4831 6.91672 18.2998 7.10005L13.3998 12L18.2998 16.9C18.4831 17.0834 18.5748 17.3167 18.5748 17.6C18.5748 17.8834 18.4831 18.1167 18.2998 18.3C18.1165 18.4834 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4834 16.8998 18.3L11.9998 13.4Z"
            fill="white" />
        </g>
      </svg>
      <div class="add-form-header">
        <svg class="form-logo" xmlns="http://www.w3.org/2000/svg" width="57" height="67" viewBox="0 0 57 67"
          fill="none">
          <path d="M40.7397 0H28.4242V13.8957H40.7397V0Z" fill="white" />
          <path
            d="M28.4243 25.197H40.7397V44.7947C40.796 49.5105 39.4275 54.1362 36.8083 58.0839C34.222 61.9194 29.2295 66.4829 19.9929 66.4829C9.93211 66.4829 4.06806 61.8167 0.903931 59.2597L8.67215 49.8621C11.7605 52.3352 14.7351 54.3696 20.0403 54.3696C24.057 54.3696 25.658 52.7645 26.5959 51.3646C27.8709 49.4203 28.5304 47.1465 28.4906 44.8321L28.4243 25.197Z"
            fill="white" />
          <path d="M22.1434 16.4248H9.82792V28.5567H22.1434V16.4248Z" fill="#29ABE2" />
          <path
            d="M47.1911 60.7904C47.1911 63.3754 45.8554 64.7659 43.9891 64.7659C42.1228 64.7659 40.9008 63.1141 40.9008 60.9211C40.9008 58.728 42.1607 56.9922 44.0933 56.9922C46.0259 56.9922 47.1911 58.7 47.1911 60.7904ZM42.3312 60.8931C42.3312 62.4516 42.966 63.5994 44.0554 63.5994C45.1449 63.5994 45.7606 62.3862 45.7606 60.7997C45.7606 59.4092 45.1922 58.1027 44.0554 58.1027C42.9186 58.1027 42.3312 59.3626 42.3312 60.8931Z"
            fill="white" />
          <path d="M49.6353 57.104V64.6445H48.2711V57.104H49.6353Z" fill="white" />
          <path
            d="M51.1131 64.6445V57.104H52.6289L54.2583 60.2116C54.6778 61.0242 55.051 61.8592 55.3762 62.7127C55.2909 61.7795 55.253 60.7063 55.253 59.5117V57.104H56.5035V64.6445H55.092L53.4436 61.4715C53.0072 60.638 52.6182 59.7812 52.2784 58.9051C52.2784 59.8384 52.3447 60.8929 52.3447 62.1901V64.6351L51.1131 64.6445Z"
            fill="white" />
        </svg>
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <svg class="horizontal-line d-block" xmlns="http://www.w3.org/2000/svg" width="94" height="4" viewBox="0 0 94 4"
          fill="none">
          <path d="M92 2L2 2" stroke="#29ABE2" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>
      <div class="initials position">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <mask id="mask0_71395_17935" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="64"
            height="64">
            <rect width="64" height="64" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_71395_17935)">
            <path
              d="M31.9993 31.9998C29.066 31.9998 26.5549 30.9554 24.466 28.8665C22.3771 26.7776 21.3327 24.2665 21.3327 21.3332C21.3327 18.3998 22.3771 15.8887 24.466 13.7998C26.5549 11.7109 29.066 10.6665 31.9993 10.6665C34.9327 10.6665 37.4438 11.7109 39.5327 13.7998C41.6216 15.8887 42.666 18.3998 42.666 21.3332C42.666 24.2665 41.6216 26.7776 39.5327 28.8665C37.4438 30.9554 34.9327 31.9998 31.9993 31.9998ZM47.9994 53.3332H15.9993C14.5327 53.3332 13.2771 52.811 12.2327 51.7665C11.1882 50.7221 10.666 49.4665 10.666 47.9998V45.8665C10.666 44.3554 11.0549 42.9665 11.8327 41.6998C12.6105 40.4332 13.6438 39.4665 14.9327 38.7998C17.6882 37.4221 20.4882 36.3887 23.3327 35.6998C26.1771 35.0109 29.066 34.6665 31.9993 34.6665C34.9327 34.6665 37.8216 35.0109 40.666 35.6998C43.5105 36.3887 46.3105 37.4221 49.066 38.7998C50.3549 39.4665 51.3882 40.4332 52.166 41.6998C52.9438 42.9665 53.3327 44.3554 53.3327 45.8665V47.9998C53.3327 49.4665 52.8105 50.7221 51.766 51.7665C50.7216 52.811 49.466 53.3332 47.9994 53.3332ZM15.9993 47.9998H47.9994V45.8665C47.9994 45.3776 47.8771 44.9332 47.6327 44.5332C47.3882 44.1332 47.066 43.8221 46.666 43.5998C44.266 42.3998 41.8438 41.4998 39.3994 40.8998C36.9549 40.2998 34.4882 39.9998 31.9993 39.9998C29.5105 39.9998 27.0438 40.2998 24.5993 40.8998C22.1549 41.4998 19.7327 42.3998 17.3327 43.5998C16.9327 43.8221 16.6105 44.1332 16.366 44.5332C16.1216 44.9332 15.9993 45.3776 15.9993 45.8665V47.9998ZM31.9993 26.6665C33.466 26.6665 34.7216 26.1443 35.766 25.0998C36.8105 24.0554 37.3327 22.7998 37.3327 21.3332C37.3327 19.8665 36.8105 18.6109 35.766 17.5665C34.7216 16.5221 33.466 15.9998 31.9993 15.9998C30.5327 15.9998 29.2771 16.5221 28.2327 17.5665C27.1882 18.6109 26.666 19.8665 26.666 21.3332C26.666 22.7998 27.1882 24.0554 28.2327 25.0998C29.2771 26.1443 30.5327 26.6665 31.9993 26.6665Z"
              fill="white" />
          </g>
        </svg>
      </div>
      <form class="form" onsubmit="addNewContact(); return false">
        <input id="add_name" type="text" placeholder="Name" required>
        <input id="add_email" type="email" name="" placeholder="E-Mail" required>
        <input id="add_phone" type="tel" name="" placeholder="Telefon" onkeypress="return isNumber(event)" onpaste="return false;" ondrop="return false;" required>
        <div class="form-buttons">
          <button id="cancel_btn" class="cancel-btn white-btn" onclick="hideAddForm()">
            Cancel
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="">
              <path
                d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z"
                stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="create-contact-btn dark-btn">
            Create contact
            <img src="../icons/check.svg" alt="">
          </button>
        </div>
      </form>
    </div>
    `
}

function editContactFormTemplate(i) {
  let initials = loadInitials(i);
  let bgColor = allContacts[i]['color'];
  let color = document.getElementById("initials" + i).style.color;
  return `
    <div id="background" class="background" onclick="hideAddForm()"></div>
    <div id="add_form" class="add-form">
      <svg onclick="hideAddForm()" class="close-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
        <mask id="mask0_114296_3949" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
          height="24">
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_114296_3949)">
          <path
            d="M11.9998 13.4L7.0998 18.3C6.91647 18.4834 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4834 5.6998 18.3C5.51647 18.1167 5.4248 17.8834 5.4248 17.6C5.4248 17.3167 5.51647 17.0834 5.6998 16.9L10.5998 12L5.6998 7.10005C5.51647 6.91672 5.4248 6.68338 5.4248 6.40005C5.4248 6.11672 5.51647 5.88338 5.6998 5.70005C5.88314 5.51672 6.11647 5.42505 6.3998 5.42505C6.68314 5.42505 6.91647 5.51672 7.0998 5.70005L11.9998 10.6L16.8998 5.70005C17.0831 5.51672 17.3165 5.42505 17.5998 5.42505C17.8831 5.42505 18.1165 5.51672 18.2998 5.70005C18.4831 5.88338 18.5748 6.11672 18.5748 6.40005C18.5748 6.68338 18.4831 6.91672 18.2998 7.10005L13.3998 12L18.2998 16.9C18.4831 17.0834 18.5748 17.3167 18.5748 17.6C18.5748 17.8834 18.4831 18.1167 18.2998 18.3C18.1165 18.4834 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4834 16.8998 18.3L11.9998 13.4Z"
            fill="white" />
        </g>
      </svg>
      <div class="add-form-header">
        <svg class="form-logo" xmlns="http://www.w3.org/2000/svg" width="57" height="67" viewBox="0 0 57 67"
          fill="none">
          <path d="M40.7397 0H28.4242V13.8957H40.7397V0Z" fill="white" />
          <path
            d="M28.4243 25.197H40.7397V44.7947C40.796 49.5105 39.4275 54.1362 36.8083 58.0839C34.222 61.9194 29.2295 66.4829 19.9929 66.4829C9.93211 66.4829 4.06806 61.8167 0.903931 59.2597L8.67215 49.8621C11.7605 52.3352 14.7351 54.3696 20.0403 54.3696C24.057 54.3696 25.658 52.7645 26.5959 51.3646C27.8709 49.4203 28.5304 47.1465 28.4906 44.8321L28.4243 25.197Z"
            fill="white" />
          <path d="M22.1434 16.4248H9.82792V28.5567H22.1434V16.4248Z" fill="#29ABE2" />
          <path
            d="M47.1911 60.7904C47.1911 63.3754 45.8554 64.7659 43.9891 64.7659C42.1228 64.7659 40.9008 63.1141 40.9008 60.9211C40.9008 58.728 42.1607 56.9922 44.0933 56.9922C46.0259 56.9922 47.1911 58.7 47.1911 60.7904ZM42.3312 60.8931C42.3312 62.4516 42.966 63.5994 44.0554 63.5994C45.1449 63.5994 45.7606 62.3862 45.7606 60.7997C45.7606 59.4092 45.1922 58.1027 44.0554 58.1027C42.9186 58.1027 42.3312 59.3626 42.3312 60.8931Z"
            fill="white" />
          <path d="M49.6353 57.104V64.6445H48.2711V57.104H49.6353Z" fill="white" />
          <path
            d="M51.1131 64.6445V57.104H52.6289L54.2583 60.2116C54.6778 61.0242 55.051 61.8592 55.3762 62.7127C55.2909 61.7795 55.253 60.7063 55.253 59.5117V57.104H56.5035V64.6445H55.092L53.4436 61.4715C53.0072 60.638 52.6182 59.7812 52.2784 58.9051C52.2784 59.8384 52.3447 60.8929 52.3447 62.1901V64.6351L51.1131 64.6445Z"
            fill="white" />
        </svg>
        <h1>Edit contact</h1>
        <svg class="horizontal-line d-block" xmlns="http://www.w3.org/2000/svg" width="94" height="4" viewBox="0 0 94 4"
          fill="none">
          <path d="M92 2L2 2" stroke="#29ABE2" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>
      <div class="initials position text" style="background-color: ${bgColor}; color: ${color}">
        <span>${initials}</span>
      </div>
      <div id="alert_container" class="alert-container d-none">
        <div class="alert-image-wrapper">
          <img class="alert-logo" src="../icons/join_logo_white.svg" alt="" />
          <h3>Information</h3>
          <img
            onclick="openOrCloseAlertContainer('alert_container', 'close')"
            class="alert-close"
            src="../icons/close_white.svg"
          />
        </div>
        <div id="alert_content" class="alert-content"></div>
      </div>
      <form class="form" onsubmit="saveContactChanges(${i}); return false">
        <input id="add_name" type="text" placeholder="Name" required>
        <input id="add_email" type="email" name="" placeholder="E-Mail" required>
        <input id="add_phone" type="tel" name="" placeholder="Telefon" onkeypress="return isNumber(event)" onpaste="return false;" ondrop="return false;" required>
        <div class="form-buttons">
          <button type="button" id="delete_btn" class="delete-btn white-btn" onclick="deleteAnUser(), hideAddForm()">
            Delete
          </button>
          <button type="submit" class="create-contact-btn dark-btn">
            Save
            <img src="../icons/check.svg" alt="">
          </button>
        </div>
      </form>
    </div>
    `
}