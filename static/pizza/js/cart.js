// Script for Cart page


// Load the Javascript after all the html content has been loaded
document.addEventListener("DOMContentLoaded", () => {
	
	// This section is for cancel button forEach
	document.querySelectorAll("#remove_button").forEach( button => {
		
		button.onclick = () => {
			if (button.dataset.cart) {
				if (confirm("Are you sure you want to remove cart: "+button.dataset.cart)) {
					const request = new XMLHttpRequest();
					request.open("POST", "cart/remove");
					const data = new FormData();
					data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
					data.append("remove_cart", button.dataset.cart);
					request.send(data);
					request.onreadystatechange = () => {
						if (request.status === 200 && request.readyState === 4) {
							if (JSON.parse(request.response)["STATUS"] === "SUCCESS") {
								alert("Successfully removed!");
								location.reload();
							} else {
								alert("Failed to remove cart!");
							}
						}
					};
				}
			} else {
				alert("Something went wrong. Please contact Support team.");
			}
		}
	});

	// This section is for checkout button forEach
	document.querySelectorAll("#checkout_button").forEach( button => {
		
		button.onclick = () => {
			var address = prompt("Add FAKE address please.")
			if (address) {
				if (button.dataset.cart) {
					const request = new XMLHttpRequest();
					request.open("POST", "cart/checkout");
					const data = new FormData();
					data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
					data.append("checkout_cart", button.dataset.cart);
					data.append("address", address);
					request.send(data);
					request.onreadystatechange = () => {
						if (request.status === 200 && request.readyState === 4) {
							if (JSON.parse(request.response)["STATUS"] === "SUCCESS") {
								alert("Checking out your order.");
								location.reload();
							} else {
								alert("Failed to checkout the cart.");
							}
						}
					}
				} else {
					alert("Something went wrong. Please contact Support team.");
				}
			} else {
				alert("Please provide an address! (A FAKE ONE)");
			}
		}
	})
})