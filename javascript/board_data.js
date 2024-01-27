let tasks = [];
let contacts = [];
let categories = [];
let currentlyEditedTask = [];
let currentDraggedElement;
let createdTask = {};

let subTasks = [];

let currentContacts = [];
let currentDueDate = '';
let currentCategories = [];

/* ---------------- title -------------------------- */
const TITLE_BOX = document.getElementById('task_title');
const TASK_TITLE_INFO_BOX = document.getElementById('task_title_info');
/* ----------------- description --------------------- */
const DESCRIPTION_BOX = document.getElementById('task_description');
/* ----------------- contacts ------------------------ */
const CONTACT_LIST_BOX = document.getElementById('contact_list'); 
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
/* ---------------------- subtasks ----------------------- */
const SUBTASKS_SMALL_SCREEN = document.getElementById('sub_tasks_small_screen');
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');

