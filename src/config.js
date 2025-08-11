// frontend/config.js
export const API_URL = "http://localhost:5000";
fetch(`${API_URL}/api/auth/register`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({ /* your data here */ })
})
