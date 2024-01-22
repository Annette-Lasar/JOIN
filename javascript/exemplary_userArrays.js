/**
* 3 exemplary pre-set tasks for logged-in users
*/
let exemplaryUserTasks = [
    {
        title: 'Implement User Authentication',
        description: 'Develop a secure user authentication system using JWT',
        current_category: [
            {
                category_name: 'Development',
                category_color: '#FFA500'
            } 
        ],         
        subtasks: [
            {
                subtask_name: 'Research JWT and its best practices',
                checked_status: false
            },
            {
                subtask_name: 'Create database schema for user information',
                checked_status: false
            },
            {
                subtask_name: 'Implement sign-up and login API endpoints',
                checked_status: false
            }  
        ],   
        completed_subtasks: 0,      
        current_contacts: [
            { 
                name: 'Bilbo Beutlin',
                e_mail: 'bilbo@gmail.com',
                phone: '0151-98765432',
                color: '#ff7a00' 
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
            }  
        ],              
        current_prio: 'urgent',                                     
        current_due_date: '2024-01-28',
        status: 'toDo'
    },
    {
        title: 'Optimize Database Queries',
        description: 'Review and optimize current database queries for efficiency',
        current_category: [
            {
                category_name: 'Technical Task',
                category_color: '#FF0000'
            } 
        ],     
        subtasks: [
            {
                subtask_name: 'Analyze current query performance',
                checked_status: false 
            },
            { 
                subtask_name: 'Identify queries that can be optimized',
                checked_status: false
            },
            {   
                subtask_name: 'Rewrite and test improved queries',
                checked_status: false
            } 
        ], 
        completed_subtasks: 0,
        current_contacts: [
            {
                name: 'Fred Feuerstein',
                e_mail: 'fredyf@gmail.com',
                phone: '040-456789012',
                color: '#fc71ff',
            }
        ],    
        current_prio: 'urgent', 
        current_due_date: '2024-01-26',        
        status: 'toDo'
    },
    {
        title: 'Organize a Virtual Escape Room Event',
        description: 'Plan and execute a virtual escape room experience for the team, aimed at improving collaboration and problem-solving skills in a fun and engaging way. This should be an opportunity for team members to interact outside of work-related projects.',
        current_category: [
            {
                category_name: 'Leisure',
                category_color: '#90EE90'
            } 
        ],     
        subtasks: [],
        completed_subtasks: 0,
        current_contacts: [
             
        ],    
        current_prio: 'urgent',
        current_due_date: '2024-02-23',
        status: 'awaitFeedback'
    }
];


/**
* 3 exemplary pre-set categories for logged-in users
*/
let exemplaryUserCategories = [
    {
        category_name: 'Technical Task',
        category_color: '#FF0000',
    },
    {
        category_name: 'Development',
        category_color: '#FFA500',
    },
    {
        category_name: 'Leisure',
        category_color: '#90EE90',
    }
];


/**
* 4 exemplary pre-set contacts for logged-in users
*/
let exemplaryUserContacts = [
    { 
        name: 'Bilbo Beutlin',
        e_mail: 'bilbo@gmail.com',
        phone: '0151-98765432',
        color: '#ff7a00' 
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
    }
];

