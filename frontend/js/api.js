// API 调用函数
async function apiCall(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '请求失败');
  }

  return response.json();
}
