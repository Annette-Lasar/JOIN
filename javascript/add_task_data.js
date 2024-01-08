let allTasks = [];
let subTasks = [];
let taskCategories = ['Technical Task', 'User Story'];
let updatedSubtask;
let allCategories = [
  {
    category_name: 'Technical Task',
    category_color: '#FF0000',
  },

  {
    category_name: 'User Story',
    category_color: '#0000FF',
  },

  {
    category_name: 'Marketing',
    category_color: '#008000',
  },

  {
    category_name: 'Development',
    category_color: '#FFA500',
  },

  {
    category_name: 'Design',
    category_color: '#DA70D6',
  },

  {
    category_name: 'Leisure',
    category_color: '#90EE90',
  },
];

let allContacts = [
  {
    name: 'Bilbo Beutlin',
    e_mail: 'bilbo@gmail.com',
    phone: '0151-98765432',
    color: '#ff7a00',
  },
  {
    name: 'Hermione Granger',
    e_mail: 'grangerh@hotmail.com',
    phone: '0172-4567890',
    color: '#9327ff',
  },
  {
    name: 'Donald Duck',
    e_mail: 'duckduckduck@gmail.com',
    phone: '030-987654321',
    color: '#6e52ff',
  },
  {
    name: 'Fred Feuerstein',
    e_mail: 'fredyf@gmail.com',
    phone: '040-456789012',
    color: '#fc71ff',
  },
  {
    name: 'Bart Simpson',
    e_mail: 'barty@gmail.com',
    phone: '089-345678901',
    color: '#ffbb2b',
  },
  {
    name: 'Sheldon Cooper',
    e_mail: 'dr.sheldoncooper@gmail.com',
    phone: '0160-87654321',
    color: '#1fd7c1',
  },
  {
    name: 'Spongebob Schwammkopf',
    e_mail: 'bikini.bottom@gmail.com',
    phone: '0157-34567890',
    color: '#462F8A',
  },
  {
    name: 'Leia Organa',
    e_mail: 'l.organa@gmail.com',
    phone: '0152-54321678',
    color: '#ff4646',
  },

  {
    name: 'Dagobert Duck',
    e_mail: 'quacktown@yahoo.com',
    phone: '0163-87654321',
    color: '#1fd7c1',
  },

  {
    name: 'Daisy Duck',
    e_mail: 'daisymail@hotmail.com',
    phone: '0221-890123456',
    color: '#fc71ff',
  },

  {
    name: 'Darth Vader',
    e_mail: 'darkside@vadermail.com',
    phone: '0351-567890123',
    color: '#462F8A',
  },

  {
    name: 'Luke Skywalker',
    e_mail: 'falcon@universe.com',
    phone: '0174-23456789',
    color: '#ff745e',
  },

  {
    name: 'Jim Knopf',
    e_mail: 'lummerland_waas@ocean.com',
    phone: '0155-76543210',
    color: '#007cee',
  },

  {
    name: 'John Silver',
    e_mail: 'treasure-island@gallows.com',
    phone: '0911-234567890',
    color: '#6e52ff',
  },

  {
    name: 'Fanny Price',
    e_mail: 'mansfield_park@freenet.com',
    phone: '0711-890123456',
    color: '#ff4646',
  },

  {
    name: 'Elizabeth Bennet',
    e_mail: 'pride_and_prejudice@web.com',
    phone: '0201-901234567',
    color: '#ffa35e',
  },

  {
    name: 'Fozzy Bear',
    e_mail: 'muppet_show@bear_mail.com',
    phone: '0611-345678901',
    color: '#ff745e',
  },

  {
    name: 'Ronald Weasley',
    e_mail: 'the_burrow@weasley.com',
    phone: '0511-789012345',
    color: '#1fd7c1',
  },

  {
    name: 'Mary Crawley',
    e_mail: 'downton_abbey@yorkshire_mail.com',
    phone: '0173-98765432',
    color: '#c3ff2b',
  },

  {
    name: 'Mickey Mouse',
    e_mail: 'mousetown@disney.com',
    phone: '0170-12345678',
    color: '#ffc701',
  },

  {
    name: 'Emil Tischbein',
    e_mail: 'parole_emil@detektive.com',
    phone: '0156 45678901',
    color: '#0038ff',
  },

  {
    name: 'Edward Ferrars',
    e_mail: 'norland_park@hotmail.com',
    phone: '0781-321098765',
    color: '#9327ff',
  },
];

let currentContacts = [];
let currentDueDates = [];
let currentCategories = [];

let id = 0;
let currentPrio = 'medium';
/* ---------------- title -------------------------- */
const TITLE_BOX = document.getElementById('task_title');
const TASK_TITLE_INFO_BOX = document.getElementById('task_title_info');
/* ----------------- contacts ------------------------ */
const CONTACT_LIST_BOX = document.getElementById('contact_list'); // contact_list
/* ------------------- prio --------------------------- */
const PRIO_BUTTON_URGENT_SMALL = document.getElementById(
  'prio_button_urgent_small'
);
const PRIO_BUTTON_MEDIUM_SMALL = document.getElementById(
  'prio_button_medium_small'
);
const PRIO_BUTTON_LOW_SMALL = document.getElementById('prio_button_low_small');
const PRIO_BUTTON_URGENT_BIG = document.getElementById(
  'prio_button_urgent_big'
);
const PRIO_BUTTON_MEDIUM_BIG = document.getElementById(
  'prio_button_medium_big'
);
const PRIO_BUTTON_LOW_BIG = document.getElementById('prio_button_low_big');
/* -------------------- due date --------------------- */
const DUE_DATE_BOX_SMALL = document.getElementById('task_due_date_small');
const DUE_DATE_BOX_BIG = document.getElementById('task_due_date_big');
const TASK_DUE_INFO_BOX_SMALL = document.getElementById('task_due_info_small');
const TASK_DUE_INFO_BOX_BIG = document.getElementById('task_due_info_big');
/* --------------------- category -------------------- */
const TASK_CATEGORY_BOX_SMALL = document.getElementById(
  'task_category_info_small'
);
const TASK_CATEGORY_BOX_BIG = document.getElementById('task_category_info_big');
const TASK_CATEGORY_SELECT_SMALL = document.getElementById(
  'task_category_small'
);
const TASK_CATEGORY_SELECT_BIG = document.getElementById('task_category_big');
const CATEGORY_LIST_SMALL = document.getElementById('category_list_small');
const CATEGORY_LIST_BIG = document.getElementById('category_list_big');
const SELECT_TASK_CATEGORY_ELEMENT_SMALL = document.getElementById(
  `task_category_text_small`
);
const SELECT_TASK_CATEGORY_ELEMENT_BIG = document.getElementById(
  `task_category_text_big`
);
/* ---------------------- subtask ----------------------- */
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');
