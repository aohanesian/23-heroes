const heroName = document.querySelector(`#heroName`);
const selectUniverse = document.querySelector(`#selectUniverse`);
const favouriteCheck = document.querySelector(`#favourite`);
const form = document.querySelector(`#formHero`);
const API = `https://61c9d37520ac1c0017ed8eac.mockapi.io`;
let body = document.body;
let tbl = document.createElement('table');
tbl.innerHTML = `<thead><td>Hero name</td><td>Universe</td><td>Favourite</td><td>Action</td></thead>`;

const controller = async (url, method = `GET`, obj) => {
    let options = {
        method: method,
        headers: {
            "Content-type": "application/json"
        }
    }
    if (obj) options.body = JSON.stringify(obj);
    let request = await fetch(url, options),
        response = request.ok ? request.json() : Promise.reject();
    return response;
}

const renderUniverse = async () => {
    try {
        let universes = await controller(API + `/universes`);
        selectUniverse.innerHTML = universes
            .map(universe => `<option value="${universe.name}">${universe.name}</option>`)
            .join(``);
    } catch (err) {
        console.log(err)
    }
}
renderUniverse();

const getHeroes = async () => {
    try {
        let heroes = await controller(API + `/heroes`)
            .then(hero => renderHeroes(hero))
    } catch (err) {
        console.log(err)
    }
}

function renderHeroes(heroes) {
    heroes.forEach(hero => tableCreate(hero))
}

function tableCreate(hero) {
    let row = tbl.insertRow();
    row.innerHTML = `<td>${hero.name}</td>
                    <td>${hero.comics}</td>`;
    // check
    let check = document.createElement("input");
    check.type = `checkbox`;
    check.checked = hero.favourite;
    check.addEventListener('change', async (evt) => {
        let changeFav = await controller(API + `/heroes/${hero.id}`, `PUT`, {favourite: check.checked});
    });
    let tdCheck = row.insertCell();
    tdCheck.innerHTML = `<label></label>`
    tdCheck.append(check);
    // check
    // del btn
    let btn = document.createElement("button");
    btn.innerHTML = "Delete";
    btn.addEventListener('click', async (evt) => {
        let del = await controller(API + `/heroes/${hero.id}`, `DELETE`);
        row.remove();
    });
    let tdBtn = document.createElement('td');
    // del btn
    tdBtn.append(btn);
    row.append(tdCheck, tdBtn);
    body.appendChild(tbl);
}

form.addEventListener(`submit`, async evt => {
    evt.preventDefault();
    let heroAdd = {
        name: heroName.value,
        comics: selectUniverse.value,
        favourite: favouriteCheck.checked,
    }
    const heroCheck = async (heroAdd) => {
        try {
            let heroes = await controller(API + `/heroes`);
            let heroExist = heroes.find(hero => heroAdd.name === hero.name);
            if (!heroExist) {
                let putHero = await controller(API + `/heroes`, `POST`, heroAdd);
                location.reload()
            } else return alert(`Hero exists!`);
        } catch (err) {
            console.log(err);
        }
    }
    await heroCheck(heroAdd);
})
getHeroes();