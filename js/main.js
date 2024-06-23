const fecha = document.querySelector('#fecha')
const input = document.querySelector('#input')
const enter = document.querySelector('#enter')
const lista = document.querySelector('#lista')

//Funcion Agregar tarea

function agregar (tarea) {
    const elemento =  `<li id="elemento">
        <p class="text line-through">${tarea}</p>
        <i class="far fa-circle co" data="realizado" id="0"></i>
        <i class="fas fa-trash de" data="eliminado" id="0"></i>
    </li> `

    lista.insertAdjacentHTML("beforeend", elemento)
}

enter.addEventListener('click',() => {
    const tarea = input.value
    if (tarea){
        agregar(tarea)
    }

    input.value=''
})
