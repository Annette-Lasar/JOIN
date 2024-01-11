// liegt auf dem Server unter dem key 'guestTasks'   
// Diese Datei dient als Backup
let tasksGuest = [

    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation...',
        current_category: ['User Story'],                           // Array mit nur einem einzigen Objekt / 1 ausgewählte Category mit Farbe und Titel
        subtasks: ['bla bla bla', 'noch mehr bla bla bla'],         // mehrere Einträge mit mehreren Subtasks
        current_contacts: ['AL', 'SM', 'JH'],                       // mehrere Kontakte mit jeweiligen Farben
        current_prio: 'urgent',                                     // 'urgent', 'medium' oder 'low' 
        current_due_date: '2024-01-28',
        status: 'toDo'
    },
    {
        id: 1,
        title: 'Kochen',
        description: 'Etwas Leckeres Kochen für die Familie...',
        current_category: ['Technical Task'],     
        subtasks: ['Gemüse schneiden', 'Küche vorbereiten'], 
        current_contacts: ['BS', 'SM', 'UZ'],   
        current_prio: 'urgent', 
        current_due_date: '2024-01-26',        
        status: 'toDo'
    },
    {
        id: 2,
        title: 'Einkaufen',
        description: 'Kartoffeln und Sprudel einkaufen',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['BS', 'SM', 'UZ'],   
        current_prio: 'low',
        current_due_date: '2024-01-24',
        status: 'inProgress'
    },
    {
        id: 3,
        title: 'Coden',
        description: 'Projekt Join fertigstellen und abgeben',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['AS', 'SM', 'JH'],   
        current_prio: 'urgent',
        current_due_date: '2024-02-23',
        status: 'awaitFeedback'
    },
    {
        id: 4,
        title: 'Lesen',
        description: 'Den neuen Hit von Annette lesen und Feedback geben',
        current_category: ['User Story'],     
        subtasks: [],
        current_contacts: ['AS','JH'],   
        current_prio: 'medium',
        current_due_date: '2024-01-28',
        status: 'done'
    }
];

