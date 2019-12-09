// Javascript for account page

document.addEventListener("DOMContentLoaded", () => {

	// Used to check the new password
	document.querySelector("#npwd").onchange = () => {
		//alert("New");
		const npwd = document.querySelector("#npwd").value;

		// Disables the submit button and deleted the confirm password
		document.querySelector("#cpwd").value = "";
		document.querySelector("#cpwd").style.borderColor = "red";
		document.querySelector("#cpwd").focus();
		document.querySelector("#sbtn").disabled = true;

		// Checks if it meets the requiremnts
		if (npwd && npwd.length > 7 && npwd.length < 65) {
			document.querySelector("#npwd").style.borderColor = "green";
		} else {
			document.querySelector("#npwd").style.borderColor = "red";
		}
	}

	// Used to compare the new password and confirm password
	document.querySelector("#cpwd").onchange = () => {
		//alert("Confirm");

		// Gets the new and confirm passwords
		const npwd = document.querySelector("#npwd").value;
		const cpwd = document.querySelector("#cpwd").value;

		// Checks if they meet the requiremnts
		if (cpwd && cpwd.length > 7 && cpwd.length < 65 && npwd == cpwd) {
			document.querySelector("#cpwd").style.borderColor = "green";
			document.querySelector("#sbtn").disabled = false;
		} else {
			document.querySelector("#cpwd").style.borderColor = "red";
			document.querySelector("#sbtn").disabled = true;
		}
	}
})
