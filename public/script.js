const API = 'http://localhost:3000/api';

// Obter token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Verificar se usuário está logado ao carregar a página
window.addEventListener('load', () => {
  if (getToken()) {
    showApp();
    loadTasks();
  }
});

// Mostrar a aplicação
function showApp() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('app').style.display = 'block';
}

// Ocultar a aplicação (para login)
function hideApp() {
  document.getElementById('auth').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

// Registrar novo usuário
async function register() {
  const username = document.getElementById('user').value.trim();
  const password = document.getElementById('pass').value.trim();

  if (!username || !password) {
    alert('Preencha usuário e senha');
    return;
  }

  try {
    const res = await fetch(API + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      alert('Usuário criado com sucesso! Faça login');
      document.getElementById('user').value = '';
      document.getElementById('pass').value = '';
    } else {
      alert('Erro: ' + (data.error || 'Falha ao registrar'));
    }
  } catch (err) {
    alert('Erro ao registrar: ' + err.message);
  }
}

// Fazer login
async function login() {
  const username = document.getElementById('user').value.trim();
  const password = document.getElementById('pass').value.trim();

  if (!username || !password) {
    alert('Preencha usuário e senha');
    return;
  }

  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showApp();
      loadTasks();
      document.getElementById('user').value = '';
      document.getElementById('pass').value = '';
    } else {
      alert('Erro: ' + (data.error || 'Falha ao fazer login'));
    }
  } catch (err) {
    alert('Erro ao fazer login: ' + err.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  hideApp();
}

// Carregar tarefas
async function loadTasks() {
  try {
    const res = await fetch(API + '/tasks', {
      headers: { 'Authorization': getToken() }
    });

    if (!res.ok) throw new Error('Erro ao carregar tarefas');

    const tasks = await res.json();

    document.getElementById('pendentes').innerHTML = '';
    document.getElementById('concluidas').innerHTML = '';

    tasks.forEach(t => {
      const div = document.createElement('div');
      div.className = 'card';

      div.innerHTML = `
        <b>${t.title}</b>
        ${t.image ? `<img src="${t.image}" style="max-width: 200px; margin: 10px 0;">` : ''}
        <br>
        ${t.status === 'pendente'
          ? `<button onclick="updateTask(${t.id}, 'concluida')">Concluir</button>`
          : `<button onclick="updateTask(${t.id}, 'pendente')">Reabrir</button>`}
        <button onclick="deleteTask(${t.id})">Excluir</button>
      `;

      if (t.status === 'pendente') {
        document.getElementById('pendentes').appendChild(div);
      } else {
        document.getElementById('concluidas').appendChild(div);
      }
    });
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// Adicionar nova tarefa
async function addTask() {
  const title = document.getElementById('taskInput').value.trim();
  const imageInput = document.getElementById('imageInput');

  if (!title) {
    alert('Digite o título da tarefa');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    const res = await fetch(API + '/tasks', {
      method: 'POST',
      headers: { 'Authorization': getToken() },
      body: formData
    });

    if (!res.ok) throw new Error('Erro ao criar tarefa');

    document.getElementById('taskInput').value = '';
    imageInput.value = '';
    loadTasks();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// Atualizar tarefa
async function updateTask(id, status) {
  try {
    const res = await fetch(API + '/tasks/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken()
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) throw new Error('Erro ao atualizar tarefa');

    loadTasks();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// Deletar tarefa
async function deleteTask(id) {
  if (!confirm('Deseja deletar esta tarefa?')) return;

  try {
    const res = await fetch(API + '/tasks/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': getToken() }
    });

    if (!res.ok) throw new Error('Erro ao deletar tarefa');

    loadTasks();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}