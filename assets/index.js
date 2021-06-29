const saveInputBtn = document.getElementById('save-input'),
	saveTabBtn = document.getElementById('save-tab'),
	deleteBtn = document.getElementById('delete'),
	inputElement = document.getElementById('input-el'),
	displayList = document.getElementById('list-container');

let currentLeads; // array of @strings links

window.onload = (e) => {
	// input field should be focused on load;
	inputElement.focus();

	// fetch current leads from localStorage;
	currentLeads = JSON.parse(localStorage.getItem('myLeads') === null)
		? []
		: JSON.parse(localStorage.getItem('myLeads'));

	renderLeads();
};

saveInputBtn.addEventListener('click', () => {
	if (inputElement.value && !checkDuplicates(inputElement.value)) {
		currentLeads.push(inputElement.value);

		saveLocalLeads();
		renderLeads();
	}
	inputElement.value = '';
});

saveTabBtn.addEventListener('click', () => {
	// https://stackoverflow.com/a/17826527
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		// since only one tab should be active and in the current window at once
		// the return variable should only have one entry

		let activeTab = tabs[0];
		if (!checkDuplicates(activeTab.url)) currentLeads.push(activeTab.url);

		saveLocalLeads();
		renderLeads();
	});
});

deleteBtn.addEventListener('click', () => {
	currentLeads = []; // reset

	renderLeads();
	saveLocalLeads();
});

/* *
 * Render Leads in HTML - Converts array into innerHTML for rendering leads.
 *
 * @param {void}
 * @returns {void}
 */
function renderLeads() {
	let listItems = '';
	currentLeads.forEach((lead) => {
		let display = lead;
		if (display.length >= 45) {
			display = lead.slice(0, 45) + '...';
		}

		listItems += `
        <li> 
            <a href="${lead}" target="_blank"> 
                ${display}
            </a>
        </li>`;
	});

	displayList.innerHTML = listItems;
}

/* *
 * Save Local Leads to the `local storage` with the key "myLeads"
 *
 * @param {void}
 * @returns {void}
 */
function saveLocalLeads() {
	localStorage.setItem('myLeads', JSON.stringify(currentLeads));
}

/* *
 * Save Local Leads to the `local storage` with the key "myLeads"
 *
 * 
 * @param string - lead to be checked, if present 
 * 
 * @returns boolean - if duplicate present in the array
 */
function checkDuplicates(lead) {
	let tempSet = new Set(currentLeads);
	return tempSet.has(lead);
}
