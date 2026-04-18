// Helplytics AI Engine - Keyword-based intelligence service
// No external API needed - uses pattern matching and keyword analysis

const CATEGORY_KEYWORDS = {
  'Academic': ['homework', 'assignment', 'exam', 'study', 'course', 'class', 'lecture', 'professor', 'grade', 'gpa', 'thesis', 'research', 'essay', 'math', 'physics', 'chemistry', 'biology', 'history', 'english', 'literature', 'university', 'college', 'school', 'semester', 'quiz', 'test', 'education', 'learning', 'tutor', 'curriculum'],
  'Technical': ['code', 'coding', 'programming', 'bug', 'error', 'debug', 'api', 'database', 'server', 'frontend', 'backend', 'react', 'node', 'python', 'javascript', 'html', 'css', 'git', 'deploy', 'hosting', 'algorithm', 'data structure', 'software', 'app', 'website', 'developer', 'framework', 'library', 'terminal', 'command', 'linux', 'windows', 'mac', 'docker', 'cloud', 'aws', 'mongodb', 'sql', 'typescript', 'java', 'php', 'angular', 'vue'],
  'Career': ['job', 'career', 'resume', 'interview', 'internship', 'portfolio', 'linkedin', 'networking', 'salary', 'hiring', 'recruiter', 'freelance', 'remote', 'mentor', 'guidance', 'professional', 'workplace', 'promotion', 'skill', 'certification', 'bootcamp'],
  'Creative': ['design', 'ui', 'ux', 'figma', 'photoshop', 'illustrator', 'graphic', 'logo', 'brand', 'animation', 'video', 'photo', 'content', 'writing', 'blog', 'social media', 'marketing', 'creative', 'art', 'music', 'illustration', 'typography'],
  'Wellness': ['stress', 'anxiety', 'mental health', 'burnout', 'motivation', 'productivity', 'balance', 'health', 'exercise', 'sleep', 'meditation', 'mindfulness', 'support', 'community', 'loneliness', 'overwhelmed', 'pressure', 'wellbeing'],
  'Finance': ['money', 'budget', 'finance', 'loan', 'scholarship', 'fee', 'payment', 'saving', 'investment', 'financial aid', 'tuition', 'expense', 'cost'],
  'Project': ['project', 'hackathon', 'team', 'collaboration', 'group', 'startup', 'idea', 'prototype', 'mvp', 'partner', 'co-founder', 'build', 'launch', 'demo']
};

const URGENCY_KEYWORDS = {
  'urgent': ['urgent', 'asap', 'emergency', 'immediately', 'right now', 'critical', 'deadline today', 'due today', 'tonight', 'hours left', 'last minute', 'desperate'],
  'high': ['deadline', 'due tomorrow', 'due soon', 'time sensitive', 'quickly', 'fast', 'hurry', 'important', 'priority', 'soon', 'this week', 'need help fast', 'running out of time'],
  'medium': ['need help', 'stuck', 'confused', 'struggling', 'would appreciate', 'having trouble', 'not sure', 'trying to', 'working on', 'looking for'],
  'low': ['curious', 'wondering', 'exploring', 'learning', 'interested', 'general', 'no rush', 'whenever', 'eventually', 'long term', 'just asking']
};

const TAG_KEYWORDS = {
  'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'express', 'npm'],
  'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'jupyter'],
  'web-dev': ['html', 'css', 'website', 'web', 'frontend', 'backend', 'fullstack', 'responsive'],
  'mobile': ['android', 'ios', 'flutter', 'react native', 'mobile', 'app'],
  'database': ['mongodb', 'sql', 'mysql', 'postgres', 'firebase', 'database', 'data'],
  'ai-ml': ['ai', 'machine learning', 'ml', 'deep learning', 'neural', 'tensorflow', 'pytorch', 'nlp'],
  'devops': ['docker', 'kubernetes', 'ci/cd', 'aws', 'cloud', 'deploy', 'hosting', 'server'],
  'design': ['ui', 'ux', 'figma', 'design', 'prototype', 'wireframe', 'mockup'],
  'career': ['resume', 'interview', 'job', 'internship', 'career', 'portfolio'],
  'academic': ['exam', 'assignment', 'homework', 'study', 'course', 'class', 'thesis'],
  'teamwork': ['team', 'collaboration', 'group', 'project', 'partner'],
  'debugging': ['bug', 'error', 'debug', 'fix', 'issue', 'problem', 'crash'],
  'api': ['api', 'rest', 'graphql', 'endpoint', 'fetch', 'axios', 'request'],
  'git': ['git', 'github', 'gitlab', 'version control', 'branch', 'merge', 'commit']
};

function analyzeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
}

function detectCategory(title, description) {
  const text = analyzeText(`${title} ${description}`);
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : 'General';
}

function detectUrgency(title, description) {
  const text = analyzeText(`${title} ${description}`);

  for (const level of ['urgent', 'high', 'medium', 'low']) {
    for (const keyword of URGENCY_KEYWORDS[level]) {
      if (text.includes(keyword)) {
        return level;
      }
    }
  }
  return 'medium';
}

function suggestTags(title, description) {
  const text = analyzeText(`${title} ${description}`);
  const tags = [];

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword) && !tags.includes(tag)) {
        tags.push(tag);
        break;
      }
    }
  }

  return tags.slice(0, 6);
}

function generateSummary(title, description) {
  const category = detectCategory(title, description);
  const urgency = detectUrgency(title, description);
  const tags = suggestTags(title, description);
  
  const urgencyLabel = {
    'urgent': 'requires immediate attention',
    'high': 'is time-sensitive',
    'medium': 'needs community support',
    'low': 'is open for discussion'
  };

  return `This ${category.toLowerCase()} request ${urgencyLabel[urgency]}. The user is seeking help with ${tags.length > 0 ? tags.join(', ') : 'a general topic'}. Community members with relevant experience are encouraged to respond.`;
}

function rewriteDescription(description) {
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return description;

  let rewritten = '**What I need help with:**\n';
  rewritten += sentences[0].trim() + '.\n\n';
  
  if (sentences.length > 1) {
    rewritten += '**More context:**\n';
    rewritten += sentences.slice(1).map(s => s.trim() + '.').join(' ') + '\n\n';
  }
  
  rewritten += '**How you can help:**\n';
  rewritten += 'Any guidance, resources, or direct assistance would be appreciated.';
  
  return rewritten;
}

function analyzeTrends(requests) {
  const categoryCount = {};
  const urgencyCount = {};
  const tagCount = {};
  const recentRequests = requests.filter(r => {
    const dayAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(r.createdAt) > dayAgo;
  });

  for (const req of requests) {
    categoryCount[req.category] = (categoryCount[req.category] || 0) + 1;
    urgencyCount[req.urgency] = (urgencyCount[req.urgency] || 0) + 1;
    for (const tag of (req.tags || [])) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return {
    totalRequests: requests.length,
    openRequests: requests.filter(r => r.status === 'open').length,
    solvedRequests: requests.filter(r => r.status === 'solved').length,
    recentActivity: recentRequests.length,
    topCategories,
    topTags,
    urgencyBreakdown: urgencyCount,
    trendingCategory: topCategories[0]?.name || 'General',
    averageUrgency: Object.entries(urgencyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium'
  };
}

function getRecommendations(userSkills, requests) {
  if (!userSkills || userSkills.length === 0) {
    return requests.filter(r => r.status === 'open').slice(0, 5);
  }

  const skillsLower = userSkills.map(s => s.toLowerCase());
  
  const scored = requests
    .filter(r => r.status === 'open')
    .map(req => {
      let score = 0;
      const reqText = `${req.title} ${req.description} ${(req.tags || []).join(' ')} ${req.category}`.toLowerCase();
      
      for (const skill of skillsLower) {
        if (reqText.includes(skill)) score += 3;
      }
      
      if (req.urgency === 'urgent') score += 4;
      else if (req.urgency === 'high') score += 2;
      
      if (req.helpers.length === 0) score += 2;
      
      return { ...req.toObject ? req.toObject() : req, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, 5);
}

function suggestSkills(interests) {
  const skillMap = {
    'programming': ['JavaScript', 'Python', 'React', 'Node.js', 'Git'],
    'web': ['HTML/CSS', 'React', 'Vue.js', 'Responsive Design', 'REST APIs'],
    'design': ['Figma', 'UI/UX', 'Adobe Creative Suite', 'Prototyping', 'Typography'],
    'data': ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Statistics'],
    'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'App Design'],
    'business': ['Marketing', 'Strategy', 'Financial Planning', 'Leadership', 'Communication'],
    'writing': ['Content Writing', 'Technical Writing', 'Copywriting', 'Editing', 'Blogging'],
    'math': ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math', 'Problem Solving'],
    'science': ['Research Methods', 'Lab Skills', 'Data Analysis', 'Scientific Writing', 'Critical Thinking']
  };

  const suggestions = new Set();
  for (const interest of (interests || [])) {
    const key = interest.toLowerCase();
    for (const [domain, skills] of Object.entries(skillMap)) {
      if (key.includes(domain) || domain.includes(key)) {
        skills.forEach(s => suggestions.add(s));
      }
    }
  }

  return Array.from(suggestions).slice(0, 8);
}

function suggestHelpAreas(skills) {
  const helpMap = {
    'javascript': ['Frontend debugging', 'React component issues', 'Node.js API problems'],
    'python': ['Data analysis help', 'Script debugging', 'Algorithm implementation'],
    'react': ['Component architecture', 'State management', 'React hooks'],
    'html': ['Page layout', 'Responsive design', 'Accessibility'],
    'css': ['Styling issues', 'Animations', 'Flexbox/Grid layouts'],
    'design': ['UI reviews', 'Wireframing', 'User flow design'],
    'git': ['Version control', 'Merge conflicts', 'Repository management'],
    'sql': ['Database queries', 'Schema design', 'Data modeling'],
    'node': ['API development', 'Server configuration', 'Database integration']
  };

  const areas = [];
  for (const skill of (skills || [])) {
    const key = skill.toLowerCase();
    for (const [domain, helps] of Object.entries(helpMap)) {
      if (key.includes(domain)) {
        helps.forEach(h => { if (!areas.includes(h)) areas.push(h); });
      }
    }
  }

  return areas.slice(0, 6);
}

module.exports = {
  detectCategory,
  detectUrgency,
  suggestTags,
  generateSummary,
  rewriteDescription,
  analyzeTrends,
  getRecommendations,
  suggestSkills,
  suggestHelpAreas
};
