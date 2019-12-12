// Javascript for Pizza Order page (pizza_checkout)

document.addEventListener("DOMContentLoaded", () => {
	
	document.querySelectorAll("#deniebtn").forEach( button => {
		
		// Send a request to the server to denie the order
		button.onclick = () => {
			if (button.dataset.order && confirm("Are you sure you want to Denie the Order?")) {
				const request = new XMLHttpRequest();
				request.open("POST", "pizzaorder/denie");
				const data = new FormData();
				data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
				data.append("order_id", button.dataset.order);
				request.send(data);
				request.onreadystatechange = () => {
					if (request.status === 200 && request.readyState === 4) {
						if (JSON.parse(request.response)["STATUS"] === "SUCCESS") {
							alert("Successfully Denied Order");
							location.reload();
						}
					}
				}
			}
		}
	});


	// Send a request to the server to see the details of the order
	document.querySelectorAll("#viewbtn").forEach( button => {
		
		button.onclick = () => {
			if (button.dataset.order) {
				const request = new XMLHttpRequest();
				request.open("POST", "pizzaorder/vieworder");
				const data = new FormData();
				data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
				data.append("order_id", button.dataset.order);
				request.send(data);
				request.onreadystatechange = () => {
					if (request.status === 200 && request.readyState === 4) {
						// Show the details of the order in the pop up box
						document.querySelector("#orderdescription").innerHTML = "<h4>Pizza Description</h4> \
																				<p>Size: "+JSON.parse(request.response)["size"]+"</p> \
																				<p>Crust: "+JSON.parse(request.response)["crust"]+"</p> \
																				<p>Amount of Toppings: "+JSON.parse(request.response)["toppings_n"]+"</p> \
																				<p>Toppings: "+JSON.parse(request.response)["selected_toppings"]+"</p> \
																				<p>Quantity: "+JSON.parse(request.response)["quantity"]+"</p> \
																				<p>Total Value: $"+JSON.parse(request.response)["total_value"]+"</p> \
																				<p>Total Price: $"+JSON.parse(request.response)["total_value_Q"]+"</p> \
																				<input type='number' id='order_id' value='"+button.dataset.order+"' disabled/>";
						
						if (JSON.parse(request.response)["status"] === "processing") {
							document.querySelector("#orderdone").innerHTML = "<button type='button' class='btn btn-warning' onclick='orderdonebtn()' data-order='"+button.dataset.order+"'><i class='fas fa-check'></i> DONE</button>";
						} else {
							document.querySelector("#orderdone").innerHTML = "";
						}
					}
				}
			}
		}
	});
})

orderdonebtn = () => {

	if (document.querySelector("#order_id").value && confirm("Are you sure the Order is Done?")) {
		const request = new XMLHttpRequest();
		request.open("POST", "pizzaorder/done");
		const data = new FormData();
		data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
		data.append("order_id", document.querySelector("#order_id").value);
		request.send(data);
		request.onreadystatechange = () => {
			if (request.status === 200 && request.readyState === 4) {
				alert("Order is Done!");
				location.reload();
			}
		}
	}
}
