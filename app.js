/* VARIAVEIS */

var addTasksContainer = document.getElementById("addTasksContainer");
var tasksDiv = document.getElementById('tasksDiv');
var editTaskButtons = document.getElementsByClassName('editTask');
var addTaskButton = document.getElementById('addTaskButton');
var closeTaskMenuButton = document.getElementById("closeTaskMenuButton");

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
    tasks += `
    <task id="showAddTaskMenuButton">
        <p>+</p>
    </task>
    `
    tasks += `</tasks>`
    localStorage.setItem('tasks',tasks.toString());
    loadTasks();
}

function loadTasks() {
    if (editTaskBoolean) {
        addTaskButton.removeEventListener('click', callEditButton);
        addTaskButton.addEventListener('click', createTask);
    }

    const parser = new DOMParser(); // Transformador de XML
    tasks = localStorage.getItem('tasks');
    
    if (localStorage.getItem('tasks') == null) {
        tasksDiv.innerHTML = 'Não existe nenhuma tarefa :(';
        tasksDiv.innerHTML = `
        <task id="showAddTaskMenuButton">
            <p>+</p>
        </task>
        `
    } else {
        tasksDiv.innerHTML = '';
        const xmlDoc = parser.parseFromString(localStorage.getItem('tasks'), "text/xml"); // Transformando XML em objeto
        tasksDiv.appendChild(xmlDoc.documentElement);

        const tasks = document.querySelectorAll('task');
        const taskArray = Array.from(tasks).map(task => task.outerHTML);
        tasksArray = taskArray;

        activateEditButtons();
    } 
    var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
    showAddTaskMenuButton.addEventListener("click", openTaskManagerMenu);
}

function activateEditButtons() {
    editTaskButtons = document.getElementsByClassName('editTask');
    for (var i = 0; i < editTaskButtons.length; i++) {
        addEditTaskEventListener(editTaskButtons[i]);
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
        <title>${taskTitle.value}</title>
        <description>${taskDescription.value}</description>
        <date>Para: ${time}</date>
        <priority>Prioridade: ${taskPriority.value}</priority>
        <progress>Status: ${taskProgress.value}</progress>
        <button id="${taskIdFromButton}" class="editTask">Editar</button>
        <button id="${taskIdFromButton}" class="deleteTask">Excluir</button>
    </task>
    `

    tasksArray.push(task);
    saveTasks();
    taskIdFromButton = '';
}

function closeTaskMenu() {
    if (taskIdFromButton != '') {
        loadTasks();
    }
    addTasksContainer.style.display = 'none';
    addTasksContainer.classList.add("hidden"); /* esconde a div */
}

/* COMEÇO DA EXECUÇÂO DO CODE */

addTaskButton.addEventListener('click', createTask);
closeTaskMenuButton.addEventListener('click', closeTaskMenu);

loadTasks();