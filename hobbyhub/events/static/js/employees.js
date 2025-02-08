document.getElementById('new-requests-btn').addEventListener('click', function() {
    document.getElementById('new-requests-table').classList.remove('hidden');
    document.getElementById('your-employees-table').classList.add('hidden');
    document.getElementById('new-requests-btn').classList.add('active');
    document.getElementById('your-employees-btn').classList.remove('active');
    document.getElementById('delete-btn').style.display='none';

    document.getElementById('new-requests-btn').style.backgroundColor = '#FFA500';
    document.getElementById('new-requests-btn').style.color = 'white';
    document.getElementById('your-employees-btn').style.backgroundColor = 'white';
    document.getElementById('your-employees-btn').style.color = '#333';

    document.querySelectorAll('#your-employees-table .employee-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
});

document.getElementById('your-employees-btn').addEventListener('click', function() {
    document.getElementById('your-employees-table').classList.remove('hidden');
    document.getElementById('new-requests-table').classList.add('hidden');
    document.getElementById('your-employees-btn').classList.add('active');
    document.getElementById('new-requests-btn').classList.remove('active');
    document.getElementById('approve-btn').classList.add('hidden');
    document.getElementById('deny-btn').classList.add('hidden');
    document.getElementById('delete-btn').classList.remove('hidden');

    document.getElementById('your-employees-btn').style.backgroundColor = '#FFA500';
    document.getElementById('your-employees-btn').style.color = 'white';
    document.getElementById('new-requests-btn').style.backgroundColor = 'white';
    document.getElementById('new-requests-btn').style.color = '#333';
    document.getElementById('approve-btn').style.display='none';
    document.getElementById('deny-btn').style.display='none';
    
    document.querySelectorAll('#new-requests-table .employee-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
});

document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateActionButtons);
});

function updateActionButtons(){
    const newRequestsChecked = document.querySelectorAll('#new-requests-table .employee-checkbox:checked').length > 0;
    const employeesChecked = document.querySelectorAll('#your-employees-table .employee-checkbox:checked').length > 0;

    document.getElementById('approve-btn').style.display = newRequestsChecked ? "block" : "none";
    document.getElementById('deny-btn').style.display = newRequestsChecked ? "block" : "none";
    document.getElementById('delete-btn').style.display = employeesChecked ? "block" : "none";
}