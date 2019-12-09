// Javascript for the add topping page

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("#remove_btn").forEach( button => {
		button.onclick = () => {

			if (confirm("Are you sure you want to remove this Topping? \n (This cannot be undone)")) {
				const request = new XMLHttpRequest();
				request.open("POST", "add_topping/remove_topping");
				const data = new FormData();
				data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
				data.append("topping_id", button.dataset.topping_id);
				request.send(data);
				request.onreadystatechange = () => {
					if (request.status === 200 && request.readyState === 4) {
						if (JSON.parse(request.response)["STATUS"]) {
							location.reload();
						}
					}
				}
			}
		}
	});

	document.querySelectorAll("#switch_toggle_btn").forEach( button => {
		button.onclick = () => {

			const request = new XMLHttpRequest();
			request.open("POST", "add_topping/switch_toggle_topping");
			const data = new FormData();
			data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
			data.append("topping_id", button.dataset.topping_id);
			if (document.querySelector("#btn_status").innerHTML === "OFF") {
				data.append("switch", document.querySelector("#btn_status").innerHTML);
			} else if (document.querySelector("#btn_status").innerHTML === "ON") {
				data.append("switch", document.querySelector("#btn_status").innerHTML);
			}
			request.send(data);
			request.onreadystatechange = () => {
				if (request.status === 200 && request.readyState === 4) {
					if (JSON.parse(request.response)["STATUS"]) {
						location.reload();
					}
				}
			}
		}
	});

	document.querySelectorAll("#print_btn").forEach( button => {
		button.onclick = () => {
			document.querySelector("#topping_price_change").innerHTML = "<input type='number' id='topping_id' class='form-control' value='"+button.dataset.topping_id+"'/>";
		}
	});

	document.querySelector("#save_changes").onclick = () => {

		if (document.querySelector("#new_price").value > 0) {

			if (confirm("Are you sure you want to change the Price?")) {
				const request = new XMLHttpRequest();
				request.open("POST", "add_topping/new_price");
				const data = new FormData();
				data.append("csrfmiddlewaretoken", document.querySelector("input[name='csrfmiddlewaretoken']").value);
				data.append("topping_id", document.querySelector("#topping_id").value);
				data.append("new_price", document.querySelector("#new_price").value);
				request.send(data);
				request.onreadystatechange = () => {
					if (request.status === 200 && request.readyState === 4) {
						if (JSON.parse(request.response)["STATUS"]) {
							location.reload();
						}
					}
				}
			}

		} else {
			alert("Please have a price higher then 0.");
		}
	}
})