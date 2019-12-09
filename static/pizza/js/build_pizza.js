// New Index Javascript ES6

var pizza_size;
var pizza_size_value = 0;
var pizza_crust;
var pizza_crust_value = 0;
var number_toppings = 0;
var number_toppings_used = 0;
var quantity = 0;

var pizza_topping_1 = "";
var pizza_topping_1_id;
var pizza_topping_1_value = 0;

var pizza_topping_2 = "";
var pizza_topping_2_id;
var pizza_topping_2_value = 0;

var pizza_topping_3 = "";
var pizza_topping_3_id;
var pizza_topping_3_value = 0;

// To keep the total value of all the selected options
var total_value = 0;
var total_value_Q = 0;

document.addEventListener("DOMContentLoaded", () => {

	// Get all form elements for pizza build
	document.querySelectorAll("#pizza_build_selection_form").forEach( elements => {
		elements.onclick = () => {
			//alert("TEST_Q: "+elements.dataset.element);
			
			// For Pizza Size Code
			//-----------------------------------------------------------------------------------
			// Set the pizza size
			if (elements.dataset.element == "small_pizza_size") {
				pizza_size = "small";
				document.querySelector("#selected_pizza_size").innerHTML = "Small 120-MZN"; // Display the selected Pizza size and value
				pizza_size_value = 120; // Set the pizza size value
			} else if (elements.dataset.element == "medium_pizza_size") {
				pizza_size = "medium";
				document.querySelector("#selected_pizza_size").innerHTML = "Medium 140-MZN"; // Display the selected Pizza size and value
				pizza_size_value = 140; // Set the pizza size value
			} else if (elements.dataset.element == "large_pizza_size") {
				pizza_size = "large";
				document.querySelector("#selected_pizza_size").innerHTML = "Large 160-MZN"; // Display the selected Pizza size and value
				pizza_size_value = 160; // Set the pizza size value
			}
			//-----------------------------------------------------------------------------------
			
			// For Pizza Crust Code
			//-----------------------------------------------------------------------------------
			// Set the pizza crust
			if (elements.dataset.element == "small_pizza_crust") {
				pizza_crust = "small";
				document.querySelector("#selected_pizza_crust").innerHTML = "Small 50-MZN"; // Display the selected Pizza size and value
				pizza_crust_value = 50; // Set the pizza crust value
			} else if (elements.dataset.element == "medium_pizza_crust") {
				pizza_crust = "medium";
				document.querySelector("#selected_pizza_crust").innerHTML = "Medium 80-MZN"; // Display the selected Pizza size and value
				pizza_crust_value = 80; // Set the pizza crust value
			} else if (elements.dataset.element == "large_pizza_crust") {
				pizza_crust = "large";
				document.querySelector("#selected_pizza_crust").innerHTML = "Large 100-MZN"; // Display the selected Pizza size and value
				pizza_crust_value = 100; // Set the pizza crust value
			}
			//-----------------------------------------------------------------------------------

			// For Pizza Topping Code
			//-----------------------------------------------------------------------------------
			if (elements.dataset.element == "1_topping") {
				number_toppings = 1;
				pizza_topping_2 = "";
				pizza_topping_2_value = 0;
				pizza_topping_3 = "";
				pizza_topping_3_value = 0;
			} else if (elements.dataset.element == "2_topping") {
				number_toppings = 2;
				pizza_topping_3 = "";
				pizza_topping_3_value = 0;
			} else if (elements.dataset.element == "3_topping") {
				number_toppings = 3;
			}

			if (number_toppings == 1) {
				document.querySelector("#number_available_toppings").innerHTML = 1;
				document.querySelector("#number_available_toppings_selected").innerHTML = 1;
			} else if (number_toppings == 2) {
				document.querySelector("#number_available_toppings").innerHTML = 2;
				document.querySelector("#number_available_toppings_selected").innerHTML = 2;
			} else if (number_toppings == 3) {
				document.querySelector("#number_available_toppings").innerHTML = 3;
				document.querySelector("#number_available_toppings_selected").innerHTML = 3;
			}

			if (number_toppings == 1) {
				document.querySelector("#selected_toppings").innerHTML = pizza_topping_1;
			} else if (number_toppings == 2) {
				document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2;
			} else if (number_toppings == 3) {
				document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2 + ", " + pizza_topping_3;
			}

			if (elements.dataset.topping) {
				const request = new XMLHttpRequest();
				request.open("POST", "build_pizza/topping");
				const data = new FormData();
				data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
				data.append("topping_id", elements.dataset.topping);
				request.send(data);
				request.onreadystatechange = () => {
					if (request.status === 200 && request.readyState === 4) {
						if (JSON.parse(request.response)) {
							if (!pizza_topping_1 &&
								!pizza_topping_1_id &&
								!pizza_topping_1_value &&
								number_toppings >= 1) {
								pizza_topping_1 = JSON.parse(request.response)["topping_name"]
								pizza_topping_1_id = JSON.parse(request.response)["topping_id"]
								pizza_topping_1_value = JSON.parse(request.response)["topping_price"]

								if (number_toppings == 1) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1;
								} else if (number_toppings == 2) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2;
								} else if (number_toppings == 3) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2 + ", " + pizza_topping_3;
								}

								if (pizza_topping_1 && !pizza_topping_2 && !pizza_topping_3 && number_toppings >= 1) {
									document.querySelector("#number_toppings_used").innerHTML = 1;
									number_toppings_used = 1;
								} else if (pizza_topping_1 && pizza_topping_2 && !pizza_topping_3 && number_toppings >= 2) {
									document.querySelector("#number_toppings_used").innerHTML = 2;
									number_toppings_used = 2;
								} else if (pizza_topping_1 && pizza_topping_2 && pizza_topping_3 && number_toppings >= 3) {
									document.querySelector("#number_toppings_used").innerHTML = 3;
									number_toppings_used = 3;
								}
					
								total_value = pizza_size_value + pizza_crust_value + pizza_topping_1_value + pizza_topping_2_value + pizza_topping_3_value;
								document.querySelector("#total_value").innerHTML = total_value;
								check_quatity(); // Check what the quatity total would be

							} else if (!pizza_topping_2 &&
									   !pizza_topping_2_id &&
									   pizza_topping_1_id != JSON.parse(request.response)["topping_id"] &&
									   !pizza_topping_2_value &&
									   number_toppings >= 2) {
								pizza_topping_2 = JSON.parse(request.response)["topping_name"]
								pizza_topping_2_id = JSON.parse(request.response)["topping_id"]
								pizza_topping_2_value = JSON.parse(request.response)["topping_price"]

								if (number_toppings == 1) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1;
								} else if (number_toppings == 2) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2;
								} else if (number_toppings == 3) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2 + ", " + pizza_topping_3;
								}

								if (pizza_topping_1 && !pizza_topping_2 && !pizza_topping_3 && number_toppings >= 1) {
									document.querySelector("#number_toppings_used").innerHTML = 1;
									number_toppings_used = 1;
								} else if (pizza_topping_1 && pizza_topping_2 && !pizza_topping_3 && number_toppings >= 2) {
									document.querySelector("#number_toppings_used").innerHTML = 2;
									number_toppings_used = 2;
								} else if (pizza_topping_1 && pizza_topping_2 && pizza_topping_3 && number_toppings >= 3) {
									document.querySelector("#number_toppings_used").innerHTML = 3;
									number_toppings_used = 3;
								}
					
								total_value = pizza_size_value + pizza_crust_value + pizza_topping_1_value + pizza_topping_2_value + pizza_topping_3_value;
								document.querySelector("#total_value").innerHTML = total_value;
								check_quatity(); // Check what the quatity total would be

							} else if (!pizza_topping_3 &&
									   !pizza_topping_3_id &&
									   pizza_topping_1_id != JSON.parse(request.response)["topping_id"] &&
									   pizza_topping_2_id != JSON.parse(request.response)["topping_id"] &&
									   !pizza_topping_3_value &&
									   number_toppings >= 3) {
								pizza_topping_3 = JSON.parse(request.response)["topping_name"]
								pizza_topping_3_id = JSON.parse(request.response)["topping_id"]
								pizza_topping_3_value = JSON.parse(request.response)["topping_price"]

								if (number_toppings == 1) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1;
								} else if (number_toppings == 2) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2;
								} else if (number_toppings == 3) {
									document.querySelector("#selected_toppings").innerHTML = pizza_topping_1 + ", " + pizza_topping_2 + ", " + pizza_topping_3;
								}

								if (pizza_topping_1 && !pizza_topping_2 && !pizza_topping_3 && number_toppings >= 1) {
									document.querySelector("#number_toppings_used").innerHTML = 1;
									number_toppings_used = 1;
								} else if (pizza_topping_1 && pizza_topping_2 && !pizza_topping_3 && number_toppings >= 2) {
									document.querySelector("#number_toppings_used").innerHTML = 2;
									number_toppings_used = 2;
								} else if (pizza_topping_1 && pizza_topping_2 && pizza_topping_3 && number_toppings >= 3) {
									document.querySelector("#number_toppings_used").innerHTML = 3;
									number_toppings_used = 3;
								}
					
								total_value = pizza_size_value + pizza_crust_value + pizza_topping_1_value + pizza_topping_2_value + pizza_topping_3_value;
								document.querySelector("#total_value").innerHTML = total_value;
								check_quatity(); // Check what the quatity total would be
							}
						} else {
							alert("Failed to get response! E1");
						}
					}
				}
			}

			total_value = pizza_size_value + pizza_crust_value + pizza_topping_1_value + pizza_topping_2_value + pizza_topping_3_value;
			document.querySelector("#total_value").innerHTML = total_value;
			check_quatity(); // Check what the quatity total would be
			//-----------------------------------------------------------------------------------
		}
	});

	// Reset button code
	document.querySelector(".reset_btn").onclick = () => {

		number_toppings_used = 0;

		pizza_topping_1 = "";
		pizza_topping_1_id = 0;
		pizza_topping_1_value = 0;
		pizza_topping_2 = "";
		pizza_topping_2_id = 0;
		pizza_topping_2_value = 0;
		pizza_topping_3 = "";
		pizza_topping_3_id = 0;
		pizza_topping_3_value = 0;

		document.querySelector("#selected_toppings").innerHTML = "";
		document.querySelector("#number_toppings_used").innerHTML = 0;

		total_value = pizza_size_value + pizza_crust_value + pizza_topping_1_value + pizza_topping_2_value + pizza_topping_3_value;
		document.querySelector("#total_value").innerHTML = total_value;
		check_quatity(); // Check what the quatity total would be
	}

	// Calculate the total price when adding quantity
	document.querySelector("#pizza_quantity").onchange = () => {
		check_quatity(); // Check what the quatity total would be
	}

	check_quatity = () => {

		// If quantity has been set display and set the multiplication of the total value by the quantity
		if (document.querySelector("#pizza_quantity").value && document.querySelector("#pizza_quantity").value > 0) {
			quantity = document.querySelector("#pizza_quantity").value;
			total_value_Q = total_value * quantity;
			document.querySelector("#total_value").innerHTML = total_value_Q;
			return true;
		} else { // If the quantity hasn't been set display the total value without multiplying it by the quantity
			document.querySelector("#total_value").innerHTML = total_value;
			return false;
		}
	}

	// Add to cart on browser storage
	document.querySelector(".add_to_cart").onclick = () => {
		
		if (pizza_size && pizza_crust &&
			number_toppings && total_value) {
			
			ready_to_send = false;
			if (number_toppings == 1 && pizza_topping_1) {
				ready_to_send = true;
			} else if (number_toppings == 2 && pizza_topping_1 && pizza_topping_2) {
				ready_to_send = true;
			} else if (number_toppings == 3 && pizza_topping_1 && pizza_topping_2 && pizza_topping_3) {
				ready_to_send = true;
			} else {
				ready_to_send = false;
				alert("Please Select your toppings ("+number_toppings_used+"/"+number_toppings+"). Thank You");
			}
			
			if (ready_to_send && confirm("CONFIRM YOUR ORDER!\nSize: "+pizza_size+"\nCrust: "+pizza_crust+"\nN# Toppings: "+number_toppings+"\nSelected Toppings: "+pizza_topping_1+","+pizza_topping_2+","+pizza_topping_3+"\nQuantity: "+quantity+"\nTotal Value: $"+total_value+"\nTotal Price: $"+total_value_Q)) {
				if (!document.querySelector("#pizza_quantity").value || document.querySelector("#pizza_quantity").value < 1 || document.querySelector("#pizza_quantity").value > 20) {
					alert("Please select a quantity between 1-20!");
					document.querySelector("#pizza_quantity").focus();
					document.querySelector("#pizza_quantity").style.borderColor = "red";
				} else {
					check_quatity(); // Check what the quatity total would be
					const request = new XMLHttpRequest();
					request.open("POST", "build_pizza");
					const data = new FormData();
					data.append("pizza_size", pizza_size);
					data.append("pizza_crust", pizza_crust);
					data.append("number_toppings", number_toppings);
					data.append("pizza_topping_1", pizza_topping_1_id);
					data.append("pizza_topping_2", pizza_topping_2_id);
					data.append("pizza_topping_3", pizza_topping_3_id);
					data.append("quantity", quantity);
					data.append("total_value", total_value);
					data.append("total_value_Q", total_value_Q);
					data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value)
					request.send(data);
					request.onreadystatechange = () => {
						if (request.status == 200 && request.readyState == 4) {
							if (JSON.parse(request.response)["STATUS"] == "FAILED") { // Check for a error that is not detailed
								alert("Failed...");
							} else if (JSON.parse(request.response)["STATUS"] == "SUCCESS") { // Check is everything went well
								alert("Added to Cart!");
								window.scrollTo(0,0); // Send the user to the top of the page
								location.reload(); // Reload the page
							} else if (JSON.parse(request.response)["STATUS"] == "PRICE_T") { // Check for an error to see if the price was tempered with
								alert("Please do not temper with the total price!");
							} else if (JSON.parse(request.response)["STATUS"] == "FAILED_NO_LOG") { // Check for an error to check if user is logged in
								alert("Please login/signup to be able to add items to your Cart.");
							}
						}
					};
				}
			}
		} else {
			alert("Please Select your other items. Thank You");
		}
	}
})