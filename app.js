/* VARIAVEIS */

var addTasksContainer = document.getElementById("addTasksContainer");
var tasksDiv = document.getElementById('tasksDiv');
var editTaskButtons = document.getElementsByClassName('editTask');
var deleteTaskButtons = document.getElementsByClassName('deleteTask');
var addTaskButton = document.getElementById('addTaskButton');
var closeTaskMenuButton = document.getElementById("closeTaskMenuButton");
var searchButton = document.getElementById('searchButton');
var searchInput = document.getElementById('search');

var tasks = ``;
var tasksArray = [];
var editTaskBoolean = false;
var taskIdFromButton = '';

/* FUNÇÔES */

function saveTasks() {
    tasks = ``;
    tasks += `<tasks>`
    tasksArray.forEach(task => {
            tasks += task;
    })
    tasks += `</tasks>`
    localStorage.setItem('tasks',tasks.toString())
    loadTasks();
}

function verifyAddTaskButton() {
    var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
    if (showAddTaskMenuButton != null) {
        document.getElementsByTagName('tasks')[0].removeChild(showAddTaskMenuButton);
    }

    document.getElementsByTagName('tasks')[0].innerHTML += `<addTask id="showAddTaskMenuButton">+</addTask>`;
}

function search() {
    var array = document.getElementsByTagName('tasks')[0].getElementsByTagName('task');
    var searchText = searchInput.value.toLowerCase();
    for (var i = 0; i < array.length; i++) {
        var titleText = array[i].getElementsByTagName('tasktitle')[0].innerHTML.toLowerCase();

        if (!titleText.includes(searchText)) {
            document.getElementsByTagName('tasks')[0].removeChild(array[i]);
        }
    }
}

function activateSearch() {
    if (searchInput.value == '') {
        loadTasks();
    } else {
        search();
    }
}

function loadTasks() {
    if (editTaskBoolean) {
        addTaskButton.removeEventListener('click', callEditButton);
        addTaskButton.addEventListener('click', createTask);
    }

    const parser = new DOMParser(); // Transformador de XML
    tasks = localStorage.getItem('tasks');
    
    if (tasks != null) {
        tasksDiv.innerHTML = '';
        const xmlDoc = parser.parseFromString(tasks, "text/xml"); // Transformando XML em objeto
        tasksDiv.appendChild(xmlDoc.documentElement);

        const tasksElements = document.querySelectorAll('task');
        const taskArray = Array.from(tasksElements).map(task => task.outerHTML);
        tasksArray = taskArray;
    }
    verifyAddTaskButton();
    var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
    showAddTaskMenuButton.addEventListener("click", openTaskManagerMenu);

    activateEditButtons();
    activateDeleteButtons();
    
    addTaskButton.addEventListener('click', createTask);
    closeTaskMenuButton.addEventListener('click', closeTaskMenu);
    searchButton.addEventListener('click', search);
    searchInput.addEventListener('input', activateSearch);
}

function activateEditButtons() {
    editTaskButtons = document.getElementsByClassName('editTask');
    for (var i = 0; i < editTaskButtons.length; i++) {
        addEditTaskEventListener(editTaskButtons[i]);
    }
}

function activateDeleteButtons() {
    deleteTaskButtons = document.getElementsByClassName('deleteTask');
    for (var i = 0; i < deleteTaskButtons.length; i++) {
        addDeleteTaskEventListener(deleteTaskButtons[i]);
    }
}

function addEditTaskEventListener(button) {
    button.addEventListener('click', () => {
        var taskFromButton = button.parentElement;
        taskIdFromButton = button.parentElement.id;
        openTaskManagerMenu();

        addTaskButton.removeEventListener('click', createTask);
        addTaskButton.addEventListener('click', callEditButton);

        tasksDiv.childNodes[0].removeChild(taskFromButton);
        
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].includes(taskIdFromButton)) {
                tasksArray.splice(i, 1);
            }
        }
    });
}

function addDeleteTaskEventListener(button) {
    button.addEventListener('click', () => {
        var taskFromButton = button.parentElement;
        taskIdFromButton = button.parentElement.id;

        tasksDiv.childNodes[0].removeChild(taskFromButton);
        
        for (var i = 0; i < tasksArray.length; i++) {
            if (tasksArray[i].includes(taskIdFromButton)) {
                tasksArray.splice(i, 1);
            }
        }

        saveTasks();
    });
}

function callEditButton() {
    editTaskBoolean = true;
    createTask(taskIdFromButton);
    editTaskBoolean = false;
    taskIdFromButton = '';
}

function openTaskManagerMenu() {
    addTasksContainer.classList.remove("hidden"); /* mostra a div */
    addTasksContainer.style.display = 'flex';
}

function randomizeNumber() {
    return Math.floor(Math.random() * 10**8);
}

function createTask() {
    if (taskIdFromButton == '') {
        taskIdFromButton = randomizeNumber();
    }

    var taskTitle = document.getElementById("taskTitle");
    var taskDescription = document.getElementById("taskDescription");
    var taskDate = document.getElementById("taskDate");
    var taskPriority = document.getElementById('taskPriority');
    var taskProgress = document.getElementById('taskProgress');

    var time = taskDate.value;
    time = time.split('T')
    timeArray = time[0].replaceAll('-','/').split('/')
    time[0] = `${timeArray[2]}/${timeArray[1]}/${timeArray[0]}`
    time = `${time[0]}, ${time[1]}`

    var task = `
    <task id="${taskIdFromButton}">
        <taskTitle>${taskTitle.value}</taskTitle>
        <taskDescription>${taskDescription.value}</taskDescription>
        <taskDate>Para: ${time}</taskDate>
        <taskPriority>Prioridade: ${taskPriority.value}</taskPriority>
        <taskProgress>Status: ${taskProgress.value}</taskProgress>
        <button id="${taskIdFromButton}" class="editTask">Editar</button>
        <button id="${taskIdFromButton}" class="deleteTask">Excluir</button>
    </task>
    `

    tasksArray.push(task);
    saveTasks();
    taskIdFromButton = '';
    closeTaskMenu();
}

function closeTaskMenu() {
    if (taskIdFromButton != '') {
        loadTasks();
    }
    addTasksContainer.style.display = 'none';
    addTasksContainer.classList.add("hidden"); /* esconde a div */
}

/* COMEÇO DA EXECUÇÂO DO CODE */

loadTasks();