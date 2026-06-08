// 检查认证状态
function checkAuth() {
  const token = localStorage.getItem('token');
  const publicPages = ['index.html', 'register.html', 'login.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (!token && !publicPages.includes(currentPage)) {
    window.location.href = 'login.html';
  }

  if (token && publicPages.includes(currentPage)) {
    window.location.href = 'dashboard.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// 获取当前用户
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// 仪表板加载
async function loadDashboard() {
  checkAuth();
  const user = getCurrentUser();
  if (user) {
    document.getElementById('username').textContent = user.username;
  }

  await loadProfileSummary();
  await loadWeightSummary();
  await loadWeightStats();
}

async function loadProfileSummary() {
  try {
    const profile = await apiCall('/api/profile', 'GET');
    const summary = document.getElementById('profileSummary');
    
    if (profile) {
      summary.innerHTML = `
        <p><strong>年龄:</strong> ${profile.age}岁</p>
        <p><strong>身高:</strong> ${profile.height}cm</p>
        <p><strong>体重:</strong> ${profile.weight}kg</p>
        <p><strong>活动水平:</strong> ${translateActivityLevel(profile.activity_level)}</p>
        <p><strong>目标:</strong> ${profile.health_goal}</p>
      `;
    } else {
      summary.innerHTML = '<p>还未完成档案，请先填写。</p>';
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

async function loadWeightSummary() {
  try {
    const history = await apiCall('/api/weight/history', 'GET');
    const summary = document.getElementById('weightSummary');
    
    if (history && history.length > 0) {
      const latest = history[0];
      summary.innerHTML = `
        <p><strong>${formatDate(latest.record_date)}</strong></p>
        <p style="font-size: 1.5em; color: #667eea;">${latest.weight}kg</p>
      `;
    } else {
      summary.innerHTML = '<p>还未记录体重。</p>';
    }
  } catch (error) {
    console.error('Failed to load weight:', error);
  }
}

async function loadWeightStats() {
  try {
    const stats = await apiCall('/api/weight/stats', 'GET');
    const statsDiv = document.getElementById('weightStats');
    
    if (stats && stats.current) {
      const change = stats.change.toFixed(1);
      const changeText = change > 0 ? `+${change}` : change;
      const changeColor = change > 0 ? '#ff6b6b' : '#51cf66';
      
      statsDiv.innerHTML = `
        <p><strong>初始体重:</strong> ${stats.initial}kg</p>
        <p><strong>当前体重:</strong> ${stats.current}kg</p>
        <p><strong style="color: ${changeColor};">变化:</strong> <span style="color: ${changeColor};">${changeText}kg</span></p>
        <p><strong>记录次数:</strong> ${stats.recordCount}次</p>
      `;
    } else {
      statsDiv.innerHTML = '<p>暂无数据。</p>';
    }
  } catch (error) {
    console.error('Failed to load weight stats:', error);
  }
}

// 加载个人档案
async function loadProfile() {
  checkAuth();
  try {
    const profile = await apiCall('/api/profile', 'GET');
    if (profile) {
      document.getElementById('age').value = profile.age;
      document.getElementById('gender').value = profile.gender;
      document.getElementById('height').value = profile.height;
      document.getElementById('weight').value = profile.weight;
      document.getElementById('activity_level').value = profile.activity_level;
      document.getElementById('dietary_preference').value = profile.dietary_preference;
      document.getElementById('health_goal').value = profile.health_goal;
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// 保存个人档案
async function saveProfile(e) {
  e.preventDefault();
  
  const profileData = {
    age: parseInt(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    height: parseFloat(document.getElementById('height').value),
    weight: parseFloat(document.getElementById('weight').value),
    activity_level: document.getElementById('activity_level').value,
    dietary_preference: document.getElementById('dietary_preference').value,
    health_goal: document.getElementById('health_goal').value
  };

  try {
    await apiCall('/api/profile', 'POST', profileData);
    showAlert('档案保存成功！', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

// 生成计划
async function generatePlan() {
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.textContent = '生成中...';

  try {
    const response = await apiCall('/api/plan/generate', 'POST', {});
    
    document.getElementById('planContainer').style.display = 'block';
    document.getElementById('planLoading').style.display = 'none';
    document.getElementById('planContent').style.display = 'block';

    const plan = response.plan;

    // 显示饮食计划
    const dietDiv = document.getElementById('dietPlan');
    if (plan.dietPlan) {
      let dietHTML = '';
      for (const [day, content] of Object.entries(plan.dietPlan)) {
        if (day !== 'summary') {
          dietHTML += `<p><strong>${translateDay(day)}:</strong> ${content}</p>`;
        }
      }
      if (plan.dietPlan.summary) {
        dietHTML += `<p><strong>周总结:</strong> ${plan.dietPlan.summary}</p>`;
      }
      dietDiv.innerHTML = dietHTML || '计划生成中...';
    }

    // 显示运动计划
    const exerciseDiv = document.getElementById('exercisePlan');
    if (plan.exercisePlan) {
      let exerciseHTML = '';
      for (const [day, content] of Object.entries(plan.exercisePlan)) {
        if (day !== 'summary') {
          exerciseHTML += `<p><strong>${translateDay(day)}:</strong> ${content}</p>`;
        }
      }
      if (plan.exercisePlan.summary) {
        exerciseHTML += `<p><strong>周总结:</strong> ${plan.exercisePlan.summary}</p>`;
      }
      exerciseDiv.innerHTML = exerciseHTML || '计划生成中...';
    }

    // 显示建议
    if (plan.tips && plan.tips.length > 0) {
      const tipsDiv = document.getElementById('tips');
      tipsDiv.innerHTML = '<ul>' + plan.tips.map(tip => `<li>${tip}</li>`).join('') + '</ul>';
    }

    showAlert('计划生成成功！', 'success');
  } catch (error) {
    showAlert('生成计划失败：' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ 生成新计划';
  }
}

// 记录体重
async function recordWeight() {
  const weight = parseFloat(document.getElementById('weight').value);
  const notes = document.getElementById('weightNotes').value;

  if (!weight || weight <= 0) {
    showAlert('请输入有效的体重值', 'error');
    return;
  }

  try {
    await apiCall('/api/weight', 'POST', { weight, notes });
    showAlert('体重记录成功！', 'success');
    document.getElementById('weight').value = '';
    document.getElementById('weightNotes').value = '';
  } catch (error) {
    showAlert('记录失败：' + error.message, 'error');
  }
}

// 加载体重历史
async function loadWeightHistory() {
  try {
    const history = await apiCall('/api/weight/history', 'GET');
    const container = document.getElementById('weightHistoryContainer');

    if (history && history.length > 0) {
      let html = `
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>体重 (kg)</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
      `;

      history.forEach(record => {
        html += `
          <tr>
            <td>${formatDate(record.record_date)}</td>
            <td>${record.weight}</td>
            <td>${record.notes || '-'}</td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '<p>还没有体重记录。</p>';
    }
  } catch (error) {
    console.error('Failed to load weight history:', error);
  }
}

// 加载计划历史
async function loadPlanHistory() {
  try {
    const history = await apiCall('/api/plan/history', 'GET');
    const container = document.getElementById('plansHistoryContainer');

    if (history && history.length > 0) {
      let html = '';

      history.forEach((plan, index) => {
        html += `
          <div class="card">
            <h4>第 ${plan.week_number} 周计划</h4>
            <p><small>${formatDate(plan.created_at)}</small></p>
            <p><strong>体重背景:</strong> ${plan.weight_context || '无'}</p>
          </div>
        `;
      });

      container.innerHTML = html;
    } else {
      container.innerHTML = '<p>还没有生成过计划。</p>';
    }
  } catch (error) {
    console.error('Failed to load plan history:', error);
  }
}

// 显示提示
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

// 辅助函数
function translateActivityLevel(level) {
  const map = {
    'low': '低（久坐）',
    'moderate': '中等（每周3-4次运动）',
    'high': '高（每周5+次运动）'
  };
  return map[level] || level;
}

function translateDay(day) {
  const map = {
    'monday': '星期一',
    'tuesday': '星期二',
    'wednesday': '星期三',
    'thursday': '星期四',
    'friday': '星期五',
    'saturday': '星期六',
    'sunday': '星期天'
  };
  return map[day] || day;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
}

// 初始化
document.addEventListener('DOMContentLoaded', checkAuth);
