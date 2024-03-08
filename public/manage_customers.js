document.getElementById('createCustomerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('customerName').value;
    const details = document.getElementById('customerDetails').value;

    fetch('/customers/create_customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, otherDetails: details }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Customer added: ' + JSON.stringify(data));
        loadCustomers(); // Reload the customer list
    })
    .catch(error => console.error('Error:', error));
});

function loadCustomers() {
    fetch('/customers/get_customers')
    .then(response => response.json())
    .then(data => {
        const customersTable = document.getElementById('customersTable').getElementsByTagName('tbody')[0];
        customersTable.innerHTML = ''; // Clear the table first

        data.customers.forEach(customer => {
            let row = customersTable.insertRow();
            row.insertCell(0).textContent = customer.id;
            row.insertCell(1).textContent = customer.name;
            row.insertCell(2).textContent = customer.other_details;

            // Actions cell
            let actionsCell = row.insertCell(3);
            actionsCell.appendChild(createDeleteButton(customer.id));
            actionsCell.appendChild(createUpdateButton(customer));
        });
    })
    .catch(error => console.error('Error:', error));
}

function createDeleteButton(customerId) {
    let btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => deleteCustomer(customerId);
    return btn;
}

function createUpdateButton(customer) {
    let btn = document.createElement('button');
    btn.textContent = 'Update';
    btn.onclick = () => showUpdateForm(customer.id, customer.name, customer.other_details);
    return btn;
}

function deleteCustomer(customerId) {
    fetch(`/customers/delete_customer/${customerId}`, { method: 'DELETE' })
    .then(() => {
        alert('Customer deleted');
        loadCustomers();
    })
    .catch(error => console.error('Error:', error));
}

// Include functions for showing update form and updating customers here

window.onload = loadCustomers;
