const API_KEY = '$2b$10$YourFreeKey'; // 注册 https://jsonbin.io/
async function submitForm(data) {
  const response = await axios.post('https://api.jsonbin.io/v3/b', data, {
    headers: { 'X-Master-Key': API_KEY }
  });
  console.log("Data saved:", response.data);
}