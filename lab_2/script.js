document.addEventListener('DOMContentLoaded', function() {
    const newListInput = document.getElementById('newListInput');
    const addListBtn = document.getElementById('addListBtn');
    const taskInput = document.getElementById('taskInput');
    const listSelect = document.getElementById('listSelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const listsContainer = document.getElementById('listsContainer');
    const deleteModal = document.getElementById('deleteModal');
    const modalTaskText = document.getElementById('modalTaskText');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const undoNotification = document.getElementById('undoNotification');
    const undoLink = document.getElementById('undoLink');

    let lists = {
        'urgent': {
            name: 'Urgent',
            tasks: [],
            collapsed: false
        },
        'important': {
            name: 'Important',
            tasks: [],
            collapsed: false
        }
    };
    let deletedTask = null;
    let taskToDelete = null;

    function init() {
        loadData();
        renderLists();
        setupEventListeners();
    }

    function loadData() {
        const saved = localStorage.getItem('todoLists');
        if (saved) lists = JSON.parse(saved);
    }

    function saveData() {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }

    function setupEventListeners() {
        addListBtn.addEventListener('click', addNewList);
        addTaskBtn.addEventListener('click', addTask);
        confirmDeleteBtn.addEventListener('click', deleteTask);
        cancelDeleteBtn.addEventListener('click', hideModal);
        undoLink.addEventListener('click', undoDelete);
    }

    function addNewList() {
        const name = newListInput.value.trim();
        if (!name) return;

        const id = name.toLowerCase().replace(/\s+/g, '-');
        if (lists[id]) return;

        lists[id] = {
            name: name,
            tasks: [],
            collapsed: false
        };

        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        listSelect.appendChild(option);

        saveData();
        renderLists();
        newListInput.value = '';
    }

    function addTask() {
        const text = taskInput.value.trim();
        const listId = listSelect.value;
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            completedDate: null,
            list: listId
        };

        lists[listId].tasks.push(task);
        saveData();
        renderLists();
        taskInput.value = '';
    }

    function renderLists() {
        listsContainer.innerHTML = '';
        for (const listId in lists) {
            const list = lists[listId];

            const card = document.createElement('div');
            card.className = 'list-card';

            const header = document.createElement('div');
            header.className = 'list-header';
            header.innerHTML = `
                <h2>${list.name}</h2>
                <span>${list.tasks.length}</span>
            `;
            header.addEventListener('click', () => toggleList(listId));

            const taskList = document.createElement('ul');
            taskList.className = 'task-list';
            if (list.collapsed) taskList.classList.add('hidden');

            list.tasks.forEach(task => {
                const item = document.createElement('li');
                item.className = 'task-item';
                if (task.completed) item.classList.add('completed');

                const text = document.createElement('span');
                text.className = 'task-text';
                text.textContent = task.text;
                text.addEventListener('click', () => toggleTask(task));

                const date = document.createElement('span');
                if (task.completedDate) {
                    date.textContent = new Date(task.completedDate).toLocaleString();
                }

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showDeleteModal(task);
                });

                item.appendChild(text);
                item.appendChild(date);
                item.appendChild(deleteBtn);
                taskList.appendChild(item);
            });

            card.appendChild(header);
            card.appendChild(taskList);
            listsContainer.appendChild(card);
        }
    }

    function toggleList(listId) {
        lists[listId].collapsed = !lists[listId].collapsed;
        saveData();
        renderLists();
    }

    function toggleTask(task) {
        const list = lists[task.list];
        const found = list.tasks.find(t => t.id === task.id);
        if (found) {
            found.completed = !found.completed;
            found.completedDate = found.completed ? new Date().toISOString() : null;
            saveData();
            renderLists();
        }
    }

    function showDeleteModal(task) {
        taskToDelete = task;
        modalTaskText.textContent = task.text;
        deleteModal.classList.remove('hidden');
    }

    function hideModal() {
        deleteModal.classList.add('hidden');
    }

    function deleteTask() {
        if (!taskToDelete) return;

        deletedTask = {...taskToDelete};
        const list = lists[taskToDelete.list];
        list.tasks = list.tasks.filter(t => t.id !== taskToDelete.id);

        saveData();
        renderLists();
        hideModal();
        showUndo();
    }

    function showUndo() {
        undoNotification.classList.remove('hidden');
        setTimeout(() => {
            undoNotification.classList.add('hidden');
            deletedTask = null;
        }, 5000);
    }

    function undoDelete(e) {
        e.preventDefault();
        if (!deletedTask) return;

        const list = lists[deletedTask.list];
        list.tasks.push(deletedTask);
        saveData();
        renderLists();
        undoNotification.classList.add('hidden');
        deletedTask = null;
    }

    init();
});
