

const API_URL = "https://testapi.io/api/sauliusenator/resource/toDoList";


function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();
    const completed = document.querySelector("#completed").checked;

    console.group('FORMOS SUBMITAS');
    console.log('Formos duomenys:', {
        title,
        description,
        completed
    });
}


function checkApiUrl() {
    console.log("API URL:", API_URL);
}

function fetchUsers() {
    checkApiUrl();

    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Pilnas GET atsakymas:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP klaida! Statusas: ${response.status}`);
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Gauti vartotojai:', data);
        console.log(`Gauti ${data.length} vartotojai.`);

        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; 

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id || 'N/A'}</td>
                    <td>${user.name || 'Nežinomas'}</td>
                    <td>${user.email || 'Nėra'}</td>
                    <td><button onclick="deleteUser(${user.id})">Ištrinti</button></td>
                `;
                userTableBody.appendChild(row);
            });
        } else {
            console.warn('Negauta jokių vartotojų duomenų');
            alert('Vartotojų sąrašas tuščias');
        }
    })
    .catch(error => {
        console.error('Vartotojų gavimo klaida:', error);
        alert(`Nepavyko gauti vartotojų: ${error.message}`);
    });
}


function validateUserInput(name, email) {
    if (!name || !email) {
        alert('Vardas ir el. paštas negali būti tušti!');
        return false;
    }
  
    return true;
}


function addUser() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!validateUserInput(name, email)) {
        return;
    }

    const newUser = {
        name: name,
        email: email
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        console.log('Pilnas POST atsakymas:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP klaida! Statusas: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {
        console.log('Gautas atsakymas pridedant vartotoją:', data);
        const userTableBody = document.getElementById('userTableBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.id || 'N/A'}</td>
            <td>${data.name || 'Nežinomas'}</td>
            <td>${data.email || 'Nėra'}</td>
            <td><button onclick="deleteUser(${data.id})">Ištrinti</button></td>
        `;
        userTableBody.appendChild(row);

        // Išvalyti įvesties laukus
        nameInput.value = '';
        emailInput.value = '';

        alert('Vartotojas sėkmingai pridėtas');
    })
    .catch(error => {
        console.error('Vartotojo pridėjimo klaida:', error);
        alert(`Nepavyko pridėti vartotojo: ${error.message}`);
    });
}

// Vartotojo šalinimo funkcija
function deleteUser(userId) {
    if (!userId) {
        alert('Netinkamas vartotojo ID');
        return;
    }

    if (!confirm(`Ar tikrai norite ištrinti vartotoją su ID: ${userId}?`)) {
        return; // Atšaukiama operacija.
    }

    fetch(`${API_URL}/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Pilnas DELETE atsakymas:', response);

        if (!response.ok) {
            throw new Error(`HTTP klaida! Statusas: ${response.status}`);
        }

        const rowToRemove = document.querySelector(`button[onclick="deleteUser(${userId})"]`).closest('tr');
        if (rowToRemove) {
            rowToRemove.remove();
        }

        alert('Vartotojas sėkmingai ištrintas');
    })
    .catch(error => {
        console.error('Vartotojo šalinimo klaida:', error);
        alert(`Nepavyko ištrinti vartotojo: ${error.message}`);
    });
}

// Pradinis vartotojų sąrašo užkrovimas
document.addEventListener('DOMContentLoaded', fetchUsers);






