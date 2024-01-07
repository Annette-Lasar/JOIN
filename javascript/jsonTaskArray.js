// liegt auf dem Server unter dem key 'guestTasks'
let tasksGuest = [

    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation...',
        current_category: ['User Story'],                           // Array mit nur einem einzigen Objekt / 1 ausgewählte Category mit Farbe und Titel
        subtasks: ['bla bla bla', 'noch mehr bla bla bla'],         // mehrere Einträge mit mehreren Subtasks
        current_contacts: ['AL', 'SM', 'JH'],                       // mehrere Kontakte mit jeweiligen Farben
        prio: 'urgent',                                             // 'urgent', 'medium' oder 'low' (mit Annette absprechen!)
        status: 'toDo'
    },
    {
        id: 1,
        title: 'Kochen',
        description: 'Etwas Leckeres Kochen für die Familie...',
        current_category: ['Technical Task'],     
        subtasks: ['Gemüse schneiden', 'Küche vorbereiten'], 
        current_contacts: ['BS', 'SM', 'UZ'],   
        prio: 'urgent',         
        status: 'toDo'
    },
    {
        id: 2,
        title: 'Einkaufen',
        description: 'Kartoffeln und Sprudel einkaufen',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['BS', 'SM', 'UZ'],   
        prio: 'low',
        status: 'inProgress'
    },
    {
        id: 3,
        title: 'Coden',
        description: 'Projekt Join fertig stellen und abgeben',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['AS', 'SM', 'JH'],   
        prio: 'urgent',
        status: 'awaitFeedback'
    },
    {
        id: 4,
        title: 'Lesen',
        description: 'Den neuen Hit von Annette lesen und Feedback geben',
        current_category: ['User Story'],     
        subtasks: [],
        current_contacts: ['AS','JH'],   
        prio: 'medium',
        status: 'done'
    }
];

