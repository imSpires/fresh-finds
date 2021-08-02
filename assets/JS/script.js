
// function to utilize dropdown menu 
// (reference from materialize)
function dropDown() {
    var dropDownEl = document.querySelectorAll('.dropdown-trigger');
    var dropDownOptions = M.Dropdown.init(dropDownEl, {
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                stopPropagation: false // Stops event propagation
    });
};

document.addEventListener('DOMContentLoaded', dropDown);

