export function fetchDataFromServer(lastName, firstName) {
    const apiUrl = `http://127.0.0.1:8000/api/so/?lastname=${encodeURIComponent(lastName)}&firstname=${encodeURIComponent(firstName)}`;
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully:', data); // Logs the data to the console
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;  // Re-throw the error to be handled by the caller
        });
}

