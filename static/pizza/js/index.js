// Javascript for index page

document.addEventListener("DOMContentLoaded", () => {
	
	// Get all the quantity field inputs
	document.querySelectorAll(".quantity").forEach( quantity => {

		// Multiply the quantity compared to the price
		quantity.onchange = () => {

			var size = 0;
			var sum = 0;
			const price = document.querySelector("#price_"+quantity.dataset.pizza).innerHTML;
			
			if (document.querySelector("#pizza_size_"+quantity.dataset.pizza).value === "S") {
				size = 120;
			} else if (document.querySelector("#pizza_size_"+quantity.dataset.pizza).value === "M") {
				size = 160;
			} else  if (document.querySelector("#pizza_size_"+quantity.dataset.pizza).value === "L") {
				size = 200;
			}

			if (!document.querySelector("#quantity_"+quantity.dataset.pizza).value) {
				sum = (parseInt(price) + parseInt(size)) * 1;
			} else {
				sum = (parseInt(price) + parseInt(size)) * document.querySelector("#quantity_"+quantity.dataset.pizza).value;
			}

			document.querySelector("#total_"+quantity.dataset.pizza).innerHTML = sum;
		}
	});

	// Get the pizza size the user wants and add new value
	document.querySelectorAll(".pizza_size").forEach( pizza_size => {

		pizza_size.onchange = () => {
			//alert(document.querySelector("#pizza_size_"+pizza_size.dataset.pizza).value);
			
			var size = 0;
			var sum = 0;
			const price = document.querySelector("#price_"+pizza_size.dataset.pizza).innerHTML;
			
			if (document.querySelector("#pizza_size_"+pizza_size.dataset.pizza).value === "S") {
				size = 120;
			} else if (document.querySelector("#pizza_size_"+pizza_size.dataset.pizza).value === "M") {
				size = 160;
			} else  if (document.querySelector("#pizza_size_"+pizza_size.dataset.pizza).value === "L") {
				size = 200;
			}

			if (!document.querySelector("#quantity_"+pizza_size.dataset.pizza).value) {
				sum = (parseInt(price) + parseInt(size)) * 1;
			} else {
				sum = (parseInt(price) + parseInt(size)) * document.querySelector("#quantity_"+pizza_size.dataset.pizza).value;
			}

			document.querySelector("#total_"+pizza_size.dataset.pizza).innerHTML = sum;
		}
	});

	// Just confirm with the user that's the order they want to make
	document.querySelectorAll(".add_to_cart").forEach( add_cart => {
		add_cart.onclick = () => {
			if (!confirm("Please confirm you want to add to cart.")) {
				return false;
			} else {
				return true;
			}
		}
	});

	// Send to build pizza page because when clicked
	// it tries sending the form so using Javascript to send the user to the page
	document.querySelectorAll(".build_pizza").forEach( button => {
		button.onclick = () => {
			location.replace("/build_pizza");
			return false; // Prevents to send a submited form to the server
		}
	})
	
	if (document.querySelector(".alert_message").innerHTML) {
		const message = document.querySelector(".alert_message");
		message.style.animationPlayState = "running";
	}
})
