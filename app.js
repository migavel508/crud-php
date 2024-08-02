document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');
    const userIdInput = document.getElementById('userId');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!validateForm(name, email)) {
            alert('Please enter valid data.');
            return;
        }

        const data = {
            id: userIdInput.value ? userIdInput.value : null,
            name: name,
            email: email
        };

        const url = data.id ? 'user.php?action=update' : 'user.php?action=create';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(() => {
            form.reset();
            userIdInput.value = '';
            loadUsers();
        });
    });

    function validateForm(name, email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return name.length > 0 && emailPattern.test(email);
    }

    function loadUsers() {
        fetch('user.php?action=read')
            .then(response => response.json())
            .then(users => {
                userTableBody.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
            });
    }

    window.editUser = (id, name, email) => {
        userIdInput.value = id;
        nameInput.value = name;
        emailInput.value = email;
    };

    window.deleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`user.php?action=delete&id=${id}`, {
                method: 'GET'
            }).then(() => {
                loadUsers();
            });
        }
    };

    loadUsers();
});
