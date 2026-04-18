const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Request = require('./models/Request');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const { detectCategory, detectUrgency, suggestTags, generateSummary } = require('./services/aiEngine');

module.exports = async function seedDatabase() {
  // Clear existing data
  await User.deleteMany({});
  await Request.deleteMany({});
  await Message.deleteMany({});
  await Notification.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const users = await User.insertMany([
    { name: 'Ahmed Khan', email: 'ahmed@helplytics.com', password, role: 'both', skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'], interests: ['web development', 'ai', 'open source'], location: 'Karachi', trustScore: 85, badges: [{ name: 'First Solve', icon: '🏅' }, { name: 'Helpful Hand', icon: '🤝' }, { name: 'Trusted Member', icon: '⭐' }], onboarded: true, isAdmin: true, requestsCreated: 5, requestsSolved: 12, helpOffered: 18 },
    { name: 'Sara Ali', email: 'sara@helplytics.com', password, role: 'canHelp', skills: ['Python', 'Data Science', 'Machine Learning', 'SQL'], interests: ['data analysis', 'research', 'teaching'], location: 'Lahore', trustScore: 72, badges: [{ name: 'First Solve', icon: '🏅' }, { name: 'Helpful Hand', icon: '🤝' }], onboarded: true, requestsCreated: 3, requestsSolved: 8, helpOffered: 14 },
    { name: 'Zain Malik', email: 'zain@helplytics.com', password, role: 'needHelp', skills: ['HTML', 'CSS', 'Figma'], interests: ['ui design', 'frontend', 'creative'], location: 'Islamabad', trustScore: 35, badges: [{ name: 'First Solve', icon: '🏅' }], onboarded: true, requestsCreated: 8, requestsSolved: 3, helpOffered: 5 },
    { name: 'Fatima Noor', email: 'fatima@helplytics.com', password, role: 'both', skills: ['React', 'TypeScript', 'Firebase', 'UI/UX'], interests: ['mobile apps', 'design systems', 'accessibility'], location: 'Karachi', trustScore: 60, badges: [{ name: 'First Solve', icon: '🏅' }, { name: 'Helpful Hand', icon: '🤝' }], onboarded: true, requestsCreated: 4, requestsSolved: 6, helpOffered: 10 },
    { name: 'Omar Raza', email: 'omar@helplytics.com', password, role: 'canHelp', skills: ['DevOps', 'Docker', 'AWS', 'Linux'], interests: ['cloud computing', 'infrastructure', 'automation'], location: 'Multan', trustScore: 48, badges: [{ name: 'First Solve', icon: '🏅' }], onboarded: true, requestsCreated: 2, requestsSolved: 5, helpOffered: 7 },
    { name: 'Ayesha Siddiqui', email: 'ayesha@helplytics.com', password, role: 'needHelp', skills: ['Content Writing', 'SEO', 'Marketing'], interests: ['digital marketing', 'blogging', 'social media'], location: 'Faisalabad', trustScore: 20, badges: [], onboarded: true, requestsCreated: 6, requestsSolved: 1, helpOffered: 2 },
    { name: 'Hassan Rauf', email: 'hassan@helplytics.com', password, role: 'both', skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'], interests: ['backend development', 'system design', 'distributed systems'], location: 'Rawalpindi', trustScore: 55, badges: [{ name: 'First Solve', icon: '🏅' }, { name: 'Helpful Hand', icon: '🤝' }], onboarded: true, requestsCreated: 3, requestsSolved: 7, helpOffered: 9 },
    { name: 'Maryam Sheikh', email: 'maryam@helplytics.com', password, role: 'both', skills: ['Flutter', 'Dart', 'Firebase', 'Mobile UI'], interests: ['mobile development', 'cross-platform', 'startups'], location: 'Peshawar', trustScore: 42, badges: [{ name: 'First Solve', icon: '🏅' }], onboarded: true, requestsCreated: 4, requestsSolved: 4, helpOffered: 6 }
  ]);

  console.log(`  ✅ Created ${users.length} users`);

  const requestData = [
    { title: 'Need help with React useEffect cleanup function', description: 'I am building a real-time chat feature and my useEffect is causing memory leaks. The component unmounts but the subscription stays active. I need help understanding how to properly clean up subscriptions in useEffect. This is urgent because my project demo is tomorrow.', author: users[2]._id },
    { title: 'Looking for Python data visualization guidance', description: 'I have a dataset with 50k rows and need to create interactive dashboards. Not sure whether to use matplotlib, plotly, or dash. Need someone experienced with data viz to guide me through the best approach for my academic project.', author: users[5]._id },
    { title: 'MongoDB aggregation pipeline help needed', description: 'Working on a complex query that requires grouping, filtering and joining multiple collections. The lookup stage is returning empty arrays and I am stuck. Need help debugging this pipeline for my e-commerce project.', author: users[2]._id },
    { title: 'Docker container networking issues', description: 'My microservices cannot communicate with each other when running in separate docker containers. I have tried docker-compose networking but the services keep timing out. Need help with docker networking and service discovery.', author: users[7]._id },
    { title: 'Resume review for frontend developer position', description: 'I am applying for junior frontend developer roles and would appreciate a review of my resume. I want to highlight my React and CSS skills effectively. Looking for career guidance and resume formatting tips.', author: users[2]._id },
    { title: 'Help with CSS Grid responsive layout', description: 'I am trying to create a responsive dashboard layout using CSS Grid. The layout should have a sidebar, header, and main content area that adapts to mobile screens. My media queries are not working as expected.', author: users[5]._id },
    { title: 'Firebase authentication setup for React app', description: 'Need help integrating Firebase Auth with my React application. I want to implement Google sign-in and email/password authentication with protected routes. Currently getting CORS errors.', author: users[7]._id },
    { title: 'Machine learning model selection guidance', description: 'I am working on a text classification project and need help choosing between BERT, LSTM, and simpler approaches like Naive Bayes. My dataset is relatively small with around 5000 samples. Need guidance on model selection and feature engineering.', author: users[2]._id },
    { title: 'Git merge conflict resolution help', description: 'Our team of 4 developers keeps running into merge conflicts in the same files. We need someone to explain branching strategies and best practices for collaborative git workflow.', author: users[5]._id },
    { title: 'Flutter state management with Riverpod', description: 'I am confused about when to use StateProvider vs StateNotifierProvider vs FutureProvider in Riverpod. Need a clear explanation with practical examples for a todo app.', author: users[7]._id },
    { title: 'SEO optimization for Next.js blog', description: 'I built a blog with Next.js but it is not ranking well on search engines. Need help with meta tags, structured data, sitemap generation, and server-side rendering best practices for SEO.', author: users[5]._id },
    { title: 'Stress management during exam season', description: 'I am a final year student feeling overwhelmed with exams, project deadlines, and job applications all happening at once. Looking for advice on time management and dealing with academic stress.', author: users[2]._id }
  ];

  const requests = [];
  for (const data of requestData) {
    const aiCategory = detectCategory(data.title, data.description);
    const aiUrgency = detectUrgency(data.title, data.description);
    const aiTags = suggestTags(data.title, data.description);
    const aiSummary = generateSummary(data.title, data.description);
    requests.push({ ...data, category: aiCategory, urgency: aiUrgency, tags: aiTags, aiCategory, aiUrgency, aiTags, aiSummary, helpers: Math.random() > 0.5 ? [users[Math.floor(Math.random() * users.length)]._id] : [], status: Math.random() > 0.7 ? 'solved' : 'open' });
  }

  const createdRequests = await Request.insertMany(requests);
  console.log(`  ✅ Created ${createdRequests.length} requests`);

  await Message.insertMany([
    { from: users[0]._id, to: users[2]._id, content: 'Hey! I saw your React question. I can help you with useEffect cleanup. Let me explain...', requestId: createdRequests[0]._id },
    { from: users[2]._id, to: users[0]._id, content: 'That would be amazing! I have been stuck on this for hours.', requestId: createdRequests[0]._id },
    { from: users[0]._id, to: users[2]._id, content: 'So the key thing is to return a cleanup function from useEffect that unsubscribes from the event source.', requestId: createdRequests[0]._id },
    { from: users[1]._id, to: users[5]._id, content: 'Hi! For data viz with 50k rows, I would recommend Plotly Dash. Much better performance than matplotlib for large datasets.', requestId: createdRequests[1]._id },
    { from: users[5]._id, to: users[1]._id, content: 'Thanks Sara! Can you share some example code for a basic Dash dashboard?', requestId: createdRequests[1]._id },
    { from: users[4]._id, to: users[7]._id, content: 'For Docker networking, check if your containers are on the same network. Use docker network inspect.', requestId: createdRequests[3]._id },
    { from: users[7]._id, to: users[4]._id, content: 'That fixed it! They were on different bridge networks. Thank you so much!', requestId: createdRequests[3]._id },
  ]);
  console.log('  ✅ Created messages');

  await Notification.insertMany([
    { user: users[2]._id, type: 'help_offered', title: 'Someone wants to help!', message: 'Ahmed Khan offered help on "React useEffect cleanup"', relatedRequest: createdRequests[0]._id, relatedUser: users[0]._id },
    { user: users[5]._id, type: 'help_offered', title: 'Help is on the way!', message: 'Sara Ali offered help on "Python data visualization"', relatedRequest: createdRequests[1]._id, relatedUser: users[1]._id },
    { user: users[0]._id, type: 'solved', title: 'Request solved!', message: '"Docker container networking" has been resolved. +10 trust!', relatedRequest: createdRequests[3]._id },
    { user: users[2]._id, type: 'badge_earned', title: 'New badge earned!', message: 'You earned the "First Solve" badge! 🏅' },
    { user: users[7]._id, type: 'new_request', title: 'New request in your area', message: 'A new Flutter-related request needs help.', relatedRequest: createdRequests[9]._id },
    { user: users[0]._id, type: 'system', title: 'Welcome to Helplytics AI!', message: 'Your profile is set up. Start helping the community today!' },
    { user: users[1]._id, type: 'help_offered', title: 'Your help matters!', message: 'Someone is grateful for your data science expertise.', relatedRequest: createdRequests[1]._id },
    { user: users[3]._id, type: 'new_request', title: 'Matching request found', message: 'A React + Firebase request matches your skills.', relatedRequest: createdRequests[6]._id },
  ]);
  console.log('  ✅ Created notifications');
  console.log('  📧 Demo: ahmed@helplytics.com / password123 (Admin)');
};
