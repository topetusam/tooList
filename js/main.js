const fecha = document.querySelector('#fecha');
const input = document.querySelector('#input');
const enter = document.querySelector('#enter');
const lista = document.querySelector('#lista');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';
let id = 0;
let LIST = [];

// Creación de fecha
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-CO', { weekday: 'long', month: 'short', day: 'numeric' });

// Función para agregar tarea a la lista
function agregar(tarea, id, realizado, eliminado) {
    if (eliminado) {
        return;
    }

    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';
    const elemento = `<li id="elemento-${id}">
        <p class="text ${LINE}">${tarea}</p>
        <i class="far ${REALIZADO} co" data-action="realizado" data-id="${id}"></i>
        <i class="fas fa-trash de" data-action="eliminado" data-id="${id}"></i>
    </li>`;

    lista.insertAdjacentHTML("beforeend", elemento);
}

// Función para obtener todas las tareas de MockAPI
async function fetchTasks() {
    try {
        const response = await fetch('https://667846bd0bd45250561e1d21.mockapi.io/task');
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        LIST = data; 
        LIST.forEach(task => {
            agregar(task.task, task.id, task.status === 'ready', false); 
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Llamar a fetchTasks al cargar la página
document.addEventListener('DOMContentLoaded', fetchTasks);

// Función tarea realizada
async function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
    const id = parseInt(element.getAttribute('data-id'));
    const index = LIST.findIndex(task => task.id === id);
    const newStatus = LIST[index].status === 'ready' ? 'On hold' : 'ready'; 
    LIST[index].status = newStatus; 
    await updateTaskStatus(id, newStatus); 
}

// Función para actualizar el estado de una tarea en MockAPI
async function updateTaskStatus(id, status) {
    try {
        const response = await fetch(`https://667846bd0bd45250561e1d21.mockapi.io/task/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error('Failed to update task status');
        }
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

// Función tarea eliminada
async function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    const id = parseInt(element.getAttribute('data-id'));
    await deleteTask(id); 
}

// Función para eliminar una tarea de MockAPI
async function deleteTask(id) {
    try {
        const response = await fetch(`https://667846bd0bd45250561e1d21.mockapi.io/task/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Evento click en el botón "I Got This!"
enter.addEventListener('click', () => {
    const tarea = input.value.trim();
    if (tarea) {
       
        addTask(tarea, 'On hold');
    }
    input.value = ''; 
    id++; 
});

// Evento keyup para la tecla Enter
document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const tarea = input.value.trim();
        if (tarea) {
            // Agregar la tarea a MockAPI con estado 'On hold'
            addTask(tarea, 'On hold');
        }
        input.value = ''; // Limpia el campo de entrada
        id++; // Incrementa el ID
    }
});

// Función para agregar una tarea a MockAPI
async function addTask(task, status) {
    try {
        const response = await fetch('https://667846bd0bd45250561e1d21.mockapi.io/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task, status }),
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        const data = await response.json();
        LIST.push({
            task: data.task,
            id: data.id,
            status: data.status,
        });
        agregar(data.task, data.id, data.status === 'ready', false); 
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Evento click en la lista para marcar como realizada o eliminar tarea
lista.addEventListener('click', function (event) {
    const element = event.target;
    const action = element.getAttribute('data-action'); 
    const id = parseInt(element.getAttribute('data-id')); 

    if (action === 'realizado') {
        tareaRealizada(element);
    } else if (action === 'eliminado') {
        tareaEliminada(element);
    }
});
