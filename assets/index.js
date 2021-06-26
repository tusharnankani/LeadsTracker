const saveInputBtn = document.getElementById("save-input"),
	saveTabBtn = document.getElementById("save-tab"),
	deleteBtn = document.getElementById("delete"),
	inputElement = document.getElementById("input-el"),
	displayList = document.getElementById("list-container");

let currentLeads; // array of @strings links

window.onload = (e) => {
	// input field should be focused on load;
	inputElement.focus();

	// fetch current leads from locaStorage;
	currentLeads = JSON.parse(localStorage.getItem("myLeads") === null)
		? []
		: JSON.parse(localStorage.getItem("myLeads"));

	renderLeads();
};

saveInputBtn.addEventListener("click", () => {
	if (inputElement.value) {
		currentLeads.push(inputElement.value);
		saveLocalLeads();
		renderLeads();
	}
	inputElement.value = "";
});

saveTabBtn.addEventListener("click", () => {
	// https://stackoverflow.com/a/17826527
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// since only one tab should be active and in the current window at once
		// the return variable should only have one entry

		let activeTab = tabs[0];
		currentLeads.push(activeTab.url);
		saveLocalLeads();
		renderLeads();
	});
});

deleteBtn.addEventListener("click", () => {
	currentLeads = []; // reset
	renderLeads();
	saveLocalLeads();
});

/* *
 * Converts array into innerHTML for rendering leads.
 *
 * @param {void}
 * @returns {void}
 */
function renderLeads() {
	let listItems = "";
	currentLeads.forEach((lead) => {
		listItems += `
        <li> 
            <a href="//${lead}" target="_blank"> 
                ${lead}
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
	localStorage.setItem("myLeads", JSON.stringify(currentLeads));
}
