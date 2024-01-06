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
    contact_first_name: 'Bilbo',
    contact_family_name: 'Beutlin',
    contact_color: '#FF0000',
  },

  {
    contact_first_name: 'Hermione',
    contact_family_name: 'Granger',
    contact_color: '#0000FF',
  },

  {
    contact_first_name: 'Donald',
    contact_family_name: 'Duck',
    contact_color: '#008000',
  },

  {
    contact_first_name: 'Donald',
    contact_family_name: 'Trump',
    contact_color: '#125476',
  },

  {
    contact_first_name: 'Dagobert',
    contact_family_name: 'Duck',
    contact_color: '#008FD1',
  },
  {
    contact_first_name: 'Daisy',
    contact_family_name: 'Duck',
    contact_color: '#7429FD',
  },
  {
    contact_first_name: 'Darth',
    contact_family_name: 'Vader',
    contact_color: '#000000',
  },
  {
    contact_first_name: 'Luke',
    contact_family_name: 'Skywalker',
    contact_color: '#8630BC',
  },
  {
    contact_first_name: 'Jim',
    contact_family_name: 'Knopf',
    contact_color: '#1234FD',
  },
  {
    contact_first_name: 'Salágia',
    contact_family_name: 'Nirlak',
    contact_color: '#765CBA',
  },
  {
    contact_first_name: 'John',
    contact_family_name: 'Silver',
    contact_color: '#0984AB',
  },
  {
    contact_first_name: 'Fanny',
    contact_family_name: 'Price',
    contact_color: '#AC7643',
  },
  {
    contact_first_name: 'Elizabeth',
    contact_family_name: 'Bennet',
    contact_color: '#AFDCAA',
  },
  {
    contact_first_name: 'Julia',
    contact_family_name: 'Wiegand',
    contact_color: '#123456',
  },
  {
    contact_first_name: 'Fozzy',
    contact_family_name: 'Bear',
    contact_color: '#987DDD',
  },
  {
    contact_first_name: 'Ronald',
    contact_family_name: 'Weasley',
    contact_color: '#777555',
  },
  {
    contact_first_name: 'Mary',
    contact_family_name: 'Crawley',
    contact_color: '#555555',
  },
  {
    contact_first_name: 'Mickey',
    contact_family_name: 'Mouse',
    contact_color: '#8866BB',
  },
  {
    contact_first_name: 'Emil',
    contact_family_name: 'Tischbein',
    contact_color: '#EE66EE',
  },
  {
    contact_first_name: 'Willi',
    contact_family_name: 'Bayer',
    contact_color: '#6D6D6D',
  },
  {
    contact_first_name: 'Edward',
    contact_family_name: 'Farres',
    contact_color: '#4E4E4E',
  },
];
let currentContacts = [];
let currentDueDates = [];
let currentCategories = [];

let id = 0;
let currentPrio = 'medium';
const TITLE_BOX = document.getElementById('task_title');
const TASK_TITLE_INFO_BOX = document.getElementById('task_title_info');
const CONTACT_LIST_BOX = document.getElementById('contact_list');
const PRIO_BUTTON_URGENT_SMALL = document.getElementById('prio_button_urgent_small');
const PRIO_BUTTON_MEDIUM_SMALL = document.getElementById('prio_button_medium_small');
const PRIO_BUTTON_LOW_SMALL = document.getElementById('prio_button_low_small');
const PRIO_BUTTON_URGENT_BIG = document.getElementById('prio_button_urgent_big');
const PRIO_BUTTON_MEDIUM_BIG = document.getElementById('prio_button_medium_big');
const PRIO_BUTTON_LOW_BIG = document.getElementById('prio_button_low_big');
const DUE_DATE_BOX_SMALL = document.getElementById('task_due_date_small');
  const DUE_DATE_BOX_BIG = document.getElementById('task_due_date_big');
const TASK_DUE_INFO_BOX_SMALL = document.getElementById('task_due_info_small');
const TASK_DUE_INFO_BOX_BIG = document.getElementById('task_due_info_big');
const TASK_CATEGORY_BOX_SMALL = document.getElementById(
  'task_category_info_small'
);
const TASK_CATEGORY_BOX_BIG = document.getElementById('task_category_info_big');
const TASK_CATEGORY_SELECT_SMALL = document.getElementById('task_category_small');
const TASK_CATEGORY_SELECT_BIG = document.getElementById('task_category_big');
const CATEGORY_LIST_SMALL = document.getElementById('category_list_small');
const CATEGORY_LIST_BIG = document.getElementById('category_list_big');
const SELECT_TASK_CATEGORY_ELEMENT_SMALL = document.getElementById(
  `task_category_text_small`
);
const SELECT_TASK_CATEGORY_ELEMENT_BIG = document.getElementById(
  `task_category_text_big`
);
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');