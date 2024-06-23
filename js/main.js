const fecha = document.querySelector('#fecha')
const input = document.querySelector('#input')
const enter = document.querySelector('#enter')
const lista = document.querySelector('#lista')
const check = 'fa-check-circle'
const uncheck = 'fa-circle'
const lineThrough = 'line-through'
let id=0



//creacion de fecha

const FECHA = new Date()
fecha.innerHTML = FECHA.toLocaleDateString('es-CO', {weekday:'long', month:'short',day:'numeric'})

//Funcion Agregar tarea

function agregar (tarea,id,realizado,eliminado) {

    if (eliminado){
        return
    }



    const REALIZADO = realizado?check : uncheck
    const LINE = realizado? lineThrough : ''
    const elemento =  `<li id="elemento">
        <p class="text ${LINE}">${tarea}</p>
        <i class="far ${REALIZADO} co" data="realizado" id=${id}"></i>
        <i class="fas fa-trash de" data="eliminado" id=${id}"></i>
    </li> `

    lista.insertAdjacentHTML("beforeend", elemento)
}

// Función tarea realizada
function tareaRealizada(element) {
    element.classList.toggle(check)
    element.classList.toggle(uncheck)
    element.parentNode.querySelector('.text').classList.toggle(lineThrough)
}

// Función tarea eliminada
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode)
}

enter.addEventListener('click',() => {
    const tarea = input.value
    if (tarea){
        agregar(tarea,id,false,false)
    }

    input.value=''
    id++
})


document.addEventListener('keyup', function(event){
    if(event.key=='Enter'){
        const tarea = input.value
        if (tarea){
            agregar(tarea, id, false, false)
        }
        
        input.value=''
        id++
    }
})


lista.addEventListener('click', function (event) {
    const element = event.target
    const elementData = element.getAttribute('data')
    if (elementData == 'realizado') {
        tareaRealizada(element)
    } else if (elementData == 'eliminado') {
        tareaEliminada(element)
    }
})
