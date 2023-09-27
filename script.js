const mainEl = document.querySelector('.main')

const formEl = document.createElement('form')

const reposContainer = document.createElement('div')
reposContainer.classList.add('repos-container')

const input = document.createElement('input')
input.classList.add('search-input')
input.setAttribute('type', 'text')
input.setAttribute('name', 'name')

const liveSearch =  document.createElement('div');
liveSearch.classList.add('live-search')

formEl.appendChild(input);
formEl.appendChild(liveSearch)
mainEl.appendChild(formEl);
mainEl.appendChild(reposContainer)

//debounce func
const debounce = (fn, debounceTime) => {
    let isCalled;
    return function () {
        const func = () => fn.apply(this, arguments);
        clearInterval(isCalled);
        isCalled = setTimeout(func, debounceTime)
    }  
};
//живой поиск
function searchRepos() {
    const els = document.querySelectorAll('.suggested-value');
    //чистим всплывающий список при каждом новом запросе
    for (let el of els) {
        el.remove();
    }
    value = this.value.trim();
    if(value.length > 0) {
        getResponse(value).then(value => {
            if (value.items.length === 0) {
                liveSearch.appendChild(createEmptyEl());
            }else {
                for (let repo of value.items) {
                    liveSearch.appendChild(createSugEl(repo));
                }
            }
        }).catch(err => console.log(err))
    }
}

const debouncedSearch = debounce(searchRepos, 400)

input.addEventListener('input', debouncedSearch)

//Получение ответа от сервера по запросу
function getResponse(value) {
    const id = `${value}+language:assembly&sort=stars&order=desc`;
    //const id = `${value}+language:assembly`;
    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/search/repositories?q=${id}`)
            .then(response => response.json())
            .then(post => resolve(post))
            .catch(err => reject(err))
    })
}

//если нет запрашиваемых репо
function createEmptyEl() {
    const element = document.createElement('div');
    element.classList.add('suggested-value')
    let name = document.createElement('p');
    name.textContent = 'No such repo';
    element.style.backgroundColor = 'red';
    element.appendChild(name);
    return element;
}
//создание всплывающих элементов поиска
function createSugEl(repo) {
    const element = document.createElement('button');
    element.setAttribute('type', 'button')
    element.classList.add('suggested-value')
    let name = document.createElement('p');
    name.innerHTML = repo.name;
    element.appendChild(name);
    element.addEventListener('click', (e) => {
        reposContainer.appendChild(createProfileEl(repo));
        //чистим всплывающий список и поле ввода 
        input.value = '';
        const els = document.querySelectorAll('.suggested-value'); 
        for (let el of els) {
            el.remove();
        }
    })
    return element;
}
//Создание карточки репо
function createProfileEl(repo) {
    const element = document.createElement('div');
    const text = document.createElement('div');
    element.classList.add('profile')
    let name = document.createElement('p');
    let owner = document.createElement('p');
    let stars = document.createElement('p');
    name.textContent = 'Name: ' + repo.name;
    owner.textContent = 'Owner: ' + repo.owner.login;
    stars.textContent = 'Stars: ' + repo.stargazers_count;
    text.appendChild(name);
    text.appendChild(owner);
    text.appendChild(stars);
    element.appendChild(text);
    element.appendChild(createDeleteButtonEl());
    return element;
}

//Создание кнопки закрытия карточки
function createDeleteButtonEl() {
    const element = document.createElement('button')
    element.setAttribute('type', 'button')
    element.classList.add('delete-button')
    element.innerHTML = '';
    element.addEventListener('click', (e) => {
        element.closest('div').remove();
    }, {once:true})
    return element;
}








