const axios = require('axios');
const config = require('../config');

class DeepseekService {
  constructor() {
    this.apiKey = config.deepseek.apiKey;
    this.apiUrl = config.deepseek.apiUrl;
  }

  async generatePlan(userProfile, weightContext = null) {
    try {
      // 构建用户信息提示词
      let systemPrompt = `你是一位专业的健康顾问和营养师。请根据用户信息生成个性化的健康方案。`;
      
      if (weightContext) {
        systemPrompt += `\n用户的体重变化背景：${weightContext}`;
      }

      const userPrompt = `
请为以下用户生成一份一周的个性化健康方案：

用户信息：
- 年龄: ${userProfile.age}岁
- 性别: ${userProfile.gender === 'male' ? '男' : '女'}
- 身高: ${userProfile.height}cm
- 体重: ${userProfile.weight}kg
- 活动水平: ${this._translateActivityLevel(userProfile.activity_level)}
- 饮食偏好: ${userProfile.dietary_preference}
- 健康目标: ${userProfile.health_goal}

请以以下JSON格式生成方案：
{
  "dietPlan": {
    "monday": "...",
    "tuesday": "...",
    ...
    "summary": "..."
  },
  "exercisePlan": {
    "monday": "...",
    "tuesday": "...",
    ...
    "summary": "..."
  },
  "tips": ["建议1", "建议2", ...]
}

确保计划详细、实用、易于执行。`;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      // 尝试解析 JSON
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parsing failed, returning raw content');
      }

      return {
        raw: content,
        dietPlan: { summary: content },
        exercisePlan: { summary: '请查看上方的完整建议' },
        tips: []
      };
    } catch (error) {
      console.error('DeepSeek API error:', error.response?.data || error.message);
      throw new Error('Failed to generate plan: ' + error.message);
    }
  }

  _translateActivityLevel(level) {
    const map = {
      'low': '低（久坐）',
      'moderate': '中等（每周3-4次运动）',
      'high': '高（每周5+次运动）'
    };
    return map[level] || level;
  }
}

module.exports = new DeepseekService();
