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
    tasks = localStorage.getItem('tasks');
    
    if (localStorage.getItem('tasks') == null) {
        tasksDiv.innerHTML = 'Não existe nenhuma tarefa :(';
    } else {
        tasksDiv.innerHTML = '';
        const xmlDoc = parser.parseFromString(localStorage.getItem('tasks'), "text/xml"); // Transformando XML em objeto
        console.log(xmlDoc.documentElement.innerHTML)
        tasksDiv.appendChild(xmlDoc.documentElement);

        const tasks = document.querySelectorAll('task');
        const taskArray = Array.from(tasks).map(task => task.outerHTML);
        tasksArray = taskArray;
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

        var time = taskDate.value;
        time = time.split('T')
        timeArray = time[0].replaceAll('-','/').split('/')
        time[0] = `${timeArray[2]}/${timeArray[1]}/${timeArray[0]}`
        time = `${time[0]}, ${time[1]}`

        var task = `
        <task>
            <title>${taskTitle.value}</title>
            <description>${taskDescription.value}</description>
            <date>Para: ${time}</date>
            <priority>Prioridade: ${taskPriority.value}</priority>
            <progress>Status: ${taskProgress.value}</progress>
        </task>
        `
        addTasksContainer.style.display = 'none';
        addTasksContainer.classList.add("hidden"); /* esconde a div */

        tasksArray.push(task);
        saveTasks();
    })
})

loadTasks();