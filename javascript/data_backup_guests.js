/**
 * The 'tasksGuest' array is the array that stores tasks from the guest login, as a guest (unlike a user) does not receive 
 * their own individual user array !
 * Is stored on the server under the key 'guestTasks' ;
 * This file serves as a backup; in case of changes, this array must be separately uploaded to the server again
 */    
let tasksGuest = [

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
        title: 'Redesign Website Homepage',
        description: 'Create a more engaging and user-friendly homepage for our corporate website. The new design should reflect our brands values and improve user experience, focusing on mobile responsiveness and intuitive navigation.',
        current_category: [
            {
                category_name: 'Design',
                category_color: '#DA70D6'
            } 
        ],     
        subtasks: [
            {
                subtask_name: 'Create high-fidelity mockups incorporating brand elements',
                checked_status: false
            },
            { 
                subtask_name: 'Collaborate with the development team for implementation',
                checked_status: false
            }
        ],
        completed_subtasks: 0,
        current_contacts: [
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
            }
        ],    
        current_prio: 'low',
        current_due_date: '2024-01-24',
        status: 'inProgress'
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
    },
    {
        title: 'Execute a Social Media Campaign',
        description: '',
        current_category: [
            {
                category_name: 'Marketing',
                category_color: '#008000'
            } 
        ],     
        subtasks: [
            {
                subtask_name: 'Develop a campaign theme and goals',
                checked_status: false
            },
            {
                subtask_name: 'Create a content calendar with daily posts and activities',
                checked_status: false
            },
            {
                subtask_name: 'Collaborate with influencers to amplify our reach',
                checked_status: false
            },
            {
                subtask_name: 'Analyze campaign performance and adjust strategies as needed',
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
            }  
        ],    
        current_prio: 'medium',
        current_due_date: '2024-01-28',
        status: 'done'
    },
    {
        title: 'Implement User Role Management',
        description: 'Develop a user role management system to assign different access levels to users. Roles should include admin, developer, and regular user. Ensure proper authentication and authorization mechanisms are in place.',
        current_category: [
            {
                category_name: 'Development',
                category_color: '#FFA500'
            } 
        ],     
        subtasks: [
            {
                subtask_name: 'Design database schema for user roles',
                checked_status: false
            },
            {
                subtask_name: 'Implement role assignment functionality',
                checked_status: false
            },
            {
                subtask_name: 'Integrate role-based access control in relevant API endpoints',
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
            }  
        ],    
        current_prio: 'urgent',
        current_due_date: '2024-02-04',
        status: 'inProgress'
    },
    {
        title: 'Set Up Automated Testing',
        description: 'Establish a robust automated testing framework for the backend codebase. This should include unit tests, integration tests, and end-to-end tests to ensure code reliability and catch potential bugs early in the development process.',
        current_category: [
            {
                category_name: 'Development',
                category_color: '#FFA500'
            } 
        ],     
        subtasks: [
            {
                subtask_name: 'Select testing frameworks and tools',
                checked_status: false
            },
            {
                subtask_name: 'Write unit tests for critical functions',
                checked_status: false
            },
            {
                subtask_name: 'Implement integration tests for API endpoints',
                checked_status: false
            },
            {
                subtask_name: 'Set up continuous integration for automated testing',
                checked_status: false
            } 
        ],
        completed_subtasks: 0,
        current_contacts: [
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
            } 
        ],    
        current_prio: 'medium',
        current_due_date: '2024-02-21',
        status: 'awaitFeedback'
    },
    {
        title: 'Introduce In-App Achievements',
        description: 'Enhance the user experience by adding a gamification element. Implement in-app achievements related to leisure activities, such as reaching a certain fitness milestone, completing coding challenges, or exploring new recipes.',
        current_category: [
            {
                category_name: 'Technical Task',
                category_color: '#FF0000'
            } 
        ],         
        subtasks: [
            {
                subtask_name: 'Define a list of achievable milestones',
                checked_status: false
            },
            {
                subtask_name: 'Develop backend logic to track user achievements',
                checked_status: false
            },
            {
                subtask_name: 'Create engaging visual representations for achievements',
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
            },
            {
                name: 'Mary Crawley',
                e_mail: 'downton_abbey@yorkshire_mail.com',
                phone: '0173-98765432',
                color: '#c3ff2b',
            }  
        ],              
        current_prio: 'low',                                     
        current_due_date: '2024-03-04',
        status: 'toDo'
    },
    {
        title: 'Implement Dark Mode for Improved User Experience',
        description: ' Introduce a dark mode feature to enhance user experience and provide an alternative visual style. Dark mode should be aesthetically pleasing, reduce eye strain in low-light environments, and seamlessly integrate with the existing design elements.',
        current_category: [
            {
                category_name: 'Design',
                category_color: '#DA70D6'
            } 
        ],         
        subtasks: [
            {
                subtask_name: 'Conduct user surveys or research to gauge interest in dark mode',
                checked_status: false
            },
            {
                subtask_name: 'Design a visually appealing dark color scheme',
                checked_status: false
            },
            {
                subtask_name: 'Implement the dark mode switch in the user settings',
                checked_status: false
            },
            {
                subtask_name: 'Test the feature across different devices for consistency',
                checked_status: false
            } 
        ],   
        completed_subtasks: 0,      
        current_contacts: [
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
            } 
        ],              
        current_prio: 'low',                                     
        current_due_date: '2024-04-16',
        status: 'awaitFeedback'
    }
];


/**
 * Is stored on the server under the key 'guestContacts'
 */
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
  
  
/**
 * Is stored on the server under the key 'guestCategories'
 */
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

