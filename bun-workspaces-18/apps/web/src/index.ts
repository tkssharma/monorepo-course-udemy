import { Hono } from 'hono';
import { APP_NAME } from '@repo/shared';

const app = new Hono();

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">${APP_NAME}</h1>
    
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">Users</h2>
      <div id="users" class="space-y-2">Loading...</div>
    </div>
    
    <div class="max-w-2xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">Add User</h2>
      <form id="addUserForm" class="space-y-4">
        <input type="text" id="name" placeholder="Name" 
          class="w-full p-2 border rounded" required>
        <input type="email" id="email" placeholder="Email" 
          class="w-full p-2 border rounded" required>
        <button type="submit" 
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add User
        </button>
      </form>
    </div>
  </div>
  
  <script>
    const API_URL = 'http://localhost:3000';
    
    async function fetchUsers() {
      const res = await fetch(API_URL + '/users');
      const { data } = await res.json();
      const usersDiv = document.getElementById('users');
      usersDiv.innerHTML = data.map(u => 
        '<div class="p-2 bg-gray-50 rounded">' + u.name + ' - ' + u.email + '</div>'
      ).join('');
    }
    
    document.getElementById('addUserForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      
      await fetch(API_URL + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      fetchUsers();
    });
    
    fetchUsers();
  </script>
</body>
</html>
`;

app.get('/', (c) => c.html(html));

const port = 3001;
console.log(`🌐 Web app running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
