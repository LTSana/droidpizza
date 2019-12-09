// Javascript ES6 for layout
var username_check_timeout;
var email_check_timeout;

var username = false;
var first_name = false;
var last_name = false;
var email = false;
var password = false;
var passwordconfirm = false;

document.addEventListener("DOMContentLoaded", () => {
	// Validate the username and check if it can be used
	check_login_username = () => {
		document.querySelector("#username").style.borderColor = "gray";
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		clearInterval(username_check_timeout);
		if (document.querySelector("#username").value.length > 0 && document.querySelector("#username").value.length < 65) {
			username_check_timeout = setTimeout(check_username, 2000);
		} else {
			document.querySelector("#username").style.borderColor = "red";
			username = false;
			toggle_signup_btn() // Check if the signup button can be activated
		}
	}
	check_username = () => {
		const request = new XMLHttpRequest();
		request.open("POST", "check_signup/checkusername");
		const data = new FormData();
		data.append("username", document.querySelector("#username").value);
		data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value)
		request.send(data)
		request.onreadystatechange = () => {
			if (request.readyState == 4 && request.status == 200) {
				if (JSON.parse(request.response)["USERNAME_STATUS"] == "BAD") {
					document.querySelector("#username").style.borderColor = "red";
					username = false;
				} else if (JSON.parse(request.response)["USERNAME_STATUS"] == "GOOD") {
					document.querySelector("#username").style.borderColor = "green";
					username = true;
				}
				toggle_signup_btn() // Check if the signup button can be activated
			}
		};
	}
	// Validate the First name
	check_login_first_name = () => {
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		if (document.querySelector("#first_name").value.length > 0 && document.querySelector("#first_name").value.length < 65) {
			document.querySelector("#first_name").style.borderColor = "green";
			first_name = true;
		} else {
			document.querySelector("#first_name").style.borderColor = "red";
			first_name = false;
		}
		toggle_signup_btn() // Check if the signup button can be activated
	}
	// Validate the Last name
	check_login_last_name = () => {
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		if (document.querySelector("#last_name").value.length > 0 && document.querySelector("#last_name").value.length < 65) {
			document.querySelector("#last_name").style.borderColor = "green";
			last_name = true;
		} else {
			document.querySelector("#last_name").style.borderColor = "red";
			last_name = false;
		}
		toggle_signup_btn() // Check if the signup button can be activated
	}
	// Validate the email and check if it can be used
	check_login_email = () => {
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		document.querySelector("#e_mail").style.borderColor = "gray";
		clearInterval(email_check_timeout)
		if (document.querySelector("#e_mail").value.length > 0 && document.querySelector("#e_mail").value.length < 65) {
			email_check_timeout = setTimeout(check_email, 2000);
		} else {
			document.querySelector("#e_mail").style.borderColor = "red";
			email = false;
			toggle_signup_btn() // Check if the signup button can be activated
		}
	}
	check_email = () => {
		const request = new XMLHttpRequest();
		const data = new FormData();
		request.open("POST", "check_signup/checkemail");
		data.append("email", document.querySelector("#e_mail").value);
		data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
		request.send(data);
		request.onreadystatechange = () => {
			if (request.readyState == 4 && request.status == 200) {
				if (JSON.parse(request.response)["EMAIL_STATUS"] == "GOOD") {
					document.querySelector("#e_mail").style.borderColor = "green";
					email = true;
				} else if (JSON.parse(request.response)["EMAIL_STATUS"] == "BAD") {
					document.querySelector("#e_mail").style.borderColor = "red";
					email = false;
				}
				toggle_signup_btn() // Check if the signup button can be activated
			}
		};
	}
	// Validate password
	check_login_password = () => {
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		if (document.querySelector("#password").value.length >= 8 && document.querySelector("#password").value.length < 65) {
			document.querySelector("#password").style.borderColor = "green";
			password = true;
			
			if (document.querySelector("#passwordconfirm").value.length >= 8 &&
				document.querySelector("#passwordconfirm").value.length <= 64 &&
				document.querySelector("#passwordconfirm").value == document.querySelector("#password").value) {
				
				document.querySelector("#passwordconfirm").style.borderColor = "green";
				passwordconfirm = true;
			} else {
				document.querySelector("#passwordconfirm").style.borderColor = "red";
				passwordconfirm = false;
			}

		} else {
			document.querySelector("#password").style.borderColor = "red";
			password = false;
		}
		toggle_signup_btn() // Check if the signup button can be activated
	}
	// Confirm that password and confirm password match
	check_login_passwordconfirm = () => {
		document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		if (document.querySelector("#passwordconfirm").value.length >= 8 &&
			document.querySelector("#passwordconfirm").value.length <= 64 &&
			document.querySelector("#passwordconfirm").value == document.querySelector("#password").value) {
			
			document.querySelector("#passwordconfirm").style.borderColor = "green";
			passwordconfirm = true;
		} else {
			document.querySelector("#passwordconfirm").style.borderColor = "red";
			passwordconfirm = false;
		}
		toggle_signup_btn() // Check if the signup button can be activated
	}
	// Check if all the required fields have been field and activate the signup button
	toggle_signup_btn = () => {
		if (username && first_name && last_name && email && password && passwordconfirm) {
			document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark'>Sign Up</button>"
		} else {
			document.querySelector(".signup_btn").innerHTML = "<button class='btn btn-dark' disabled>Sign Up</button>"
		}
	}
});