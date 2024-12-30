var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
var addTasksContainer = document.getElementById("addTasksContainer");
var tasksDiv = document.getElementById('tasksDiv');

var tasks = ``;
var tasksArray = [];

function saveTasks() {
    tasks = ``;
    tasks += `<tasks>`
    tasksArray.forEach(task => {
            tasks += task;
    })
    tasks += `</tasks>`
    localStorage.setItem('tasks',tasks.toString());
    loadTasks();
}

function loadTasks() {
    const parser = new DOMParser(); // Transformador de XML
    
    if (localStorage.getItem('tasks') == null) {
        tasksDiv.innerHTML = 'Não existe nenhuma tarefa :(';
    } else {
        tasksDiv.innerHTML = '';
        const xmlDoc = parser.parseFromString(localStorage.getItem('tasks'), "text/xml"); // Transformando XML em objeto
        tasksDiv.appendChild(xmlDoc.documentElement);
    } 
}

showAddTaskMenuButton.addEventListener("click", () => {
    addTasksContainer.classList.remove("hidden"); /* mostra a div */
    addTasksContainer.style.display = 'flex';

    var addTaskButton = document.getElementById('addTaskButton');

    addTaskButton.addEventListener('click', () => {
        var taskTitle = document.getElementById("taskTitle");
        var taskDescription = document.getElementById("taskDescription");
        var taskDate = document.getElementById("taskDate");
        var taskPriority = document.getElementById('taskPriority');
        var taskProgress = document.getElementById('taskProgress');

        var tasksLength = tasks.length;

        var task = `
        <task>
            <title>${taskTitle.value}</title>
            <description>${taskDescription.value}</description>
            <date>${taskDate.value}</date>
            <priority>${taskPriority.value}</priority>
            <progress>${taskProgress.value}</progress>
        </task>
        `
        addTasksContainer.style.display = 'none';
        addTasksContainer.classList.add("hidden"); /* esconde a div */

        tasksArray.push(task);
        saveTasks();
    })
})

loadTasks();