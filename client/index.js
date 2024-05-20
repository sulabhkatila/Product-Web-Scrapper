let showElements = false;

console.log('hello')

const displayElements = () => {
	console.log('need to display')
};

const hideElements = () => {
	console.log('no')
};

document.addEventListener('DOMContentLoaded', () => {
  
    const switchInput = document.querySelector('.switch input');
	
	if (showElements) {
		switchInput.checked = true;
		displayElements();
	} else {
		switchInput.checked = false;
		hideElements();
	}

    switchInput.addEventListener('change', () => {
        if (switchInput.checked) {
            showElements = true;
			displayElements();
        } else {
			showElements = false;
			hideElements();
		}
    });
});