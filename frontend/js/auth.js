async function registerUser() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    showAlert('两次输入的密码不一致', 'error');
    return;
  }

  if (password.length < 6) {
    showAlert('密码长度至少6个字符', 'error');
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '注册失败');
    }

    showAlert('注册成功！请登录。', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function loginUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '登录失败');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showAlert('登录成功！', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.textContent = message;
  alert.style.display = 'block';
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '9999';
  alert.style.maxWidth = '400px';

  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}
