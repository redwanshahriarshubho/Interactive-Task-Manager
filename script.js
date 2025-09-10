document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item bg-white rounded-lg shadow p-4 flex justify-between items-center ${task.completed ? 'completed-task' : ''}`;
            
            taskEl.innerHTML = `
                <div class="flex items-center gap-3">
                    <input type="checkbox" class="task-checkbox w-5 h-5 text-indigo-600" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="delete-btn text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            
            taskList.appendChild(taskEl);
            
            // Event listeners
            const checkbox = taskEl.querySelector('.task-checkbox');
            const deleteBtn = taskEl.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => toggleTask(index));
            deleteBtn.addEventListener('click', () => deleteTask(index));
        });
    }

    // Add task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Save to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial render
    renderTasks();
});