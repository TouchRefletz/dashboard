var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
var addTasksContainer = document.getElementById("addTasksContainer");

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

        var task = {
            title: taskTitle.value,
            description: taskDescription.value,
            date: taskDate.value,
            priority: taskPriority.value,
            progress: taskProgress.value
        }

        console.log(task);
    })
})