// 工具函数

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN');
}

function calculateBMI(height, weight) {
  if (height <= 0 || weight <= 0) return 0;
  return (weight / ((height / 100) ** 2)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24.9) return '正常';
  if (bmi < 29.9) return '超重';
  return '肥胖';
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
