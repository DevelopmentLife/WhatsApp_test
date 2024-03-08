document.getElementById('createCustomerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('customerName').value;
    const otherDetails = document.getElementById('customerDetails').value;

    fetch('/create_customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, otherDetails: otherDetails }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Customer created: ' + JSON.stringify(data));
        // Update UI as needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const customerId = document.getElementById('customerId').value;
    const numberId = document.getElementById('numberId').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const messageContent = document.getElementById('messageContent').value;

    // Assuming you have logic to ensure customerId and numberId are valid...

    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber, message: messageContent, number_id: numberId }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent: ' + JSON.stringify(data));
        // Update UI or refresh data as needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Assuming the endpoint to fetch messages is '/messages/get_all'
function loadMessages() {
    fetch('/messages/get_all')
    .then(response => response.json())
    .then(data => {
        const messagesTable = document.getElementById('messagesTable');
        
        data.messages.forEach(msg => {
            let row = messagesTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);

            cell1.innerHTML = msg.id;
            cell2.innerHTML = msg.phone_number;
            cell3.innerHTML = msg.message;
            cell4.innerHTML = msg.status;
            cell5.innerHTML = msg.customer_id;
        });
    })
    .catch(error => console.error('Error:', error));
}

window.onload = loadMessages;  // Call loadMessages when the page loads


// Add more JavaScript as needed for handling additional UI elements and actions
