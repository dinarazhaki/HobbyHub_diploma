function toggleDropdown(button) {
    let dropdown = button.nextElementSibling;
    let rect = button.getBoundingClientRect();
    let dropdownHeight = dropdown.offsetHeight;
    let windowHeight = window.innerHeight;

    // Position dropdown relative to button inside .dropdown
    let dropdownTop = button.offsetHeight + 5;
    if (rect.bottom + dropdownHeight > windowHeight) {
        dropdownTop = -dropdownHeight - 5; // Move above button if cut off
    }

    dropdown.style.top = dropdownTop + "px";
    dropdown.classList.toggle("show");

    // Close other dropdowns
    document.querySelectorAll(".dropdown-content").forEach(menu => {
        if (menu !== dropdown) menu.classList.remove("show");
    });
}

// Close dropdown if clicked outside
window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
        document.querySelectorAll(".dropdown-content").forEach(menu => {
            menu.classList.remove("show");
        });
    }
};

