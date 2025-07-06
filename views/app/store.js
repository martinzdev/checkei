class store {
  constructor() {
    this.storageKey = 'checkei_data';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          tasks: data.tasks || [],
          activity: data.activity || {},
          settings: data.settings || {},
          lastAccess: data.lastAccess || null
        };
      }
    } catch (error) {
      console.warn('Error loading data from localStorage:', error);
    }

    return {
      tasks: [],
      activity: {},
      settings: {},
      lastAccess: null
    };
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  getTasks() {
    return this.data.tasks;
  }

  addTask(text) {
    const task = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.data.tasks.unshift(task);
    this.saveData();
    return task;
  }

  updateTask(id, updates) {
    const taskIndex = this.data.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.data.tasks[taskIndex] = { ...this.data.tasks[taskIndex], ...updates };
      this.saveData();
      return this.data.tasks[taskIndex];
    }
    return null;
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(task => task.id !== id);
    this.saveData();
  }

  clearCompleted() {
    this.data.tasks = this.data.tasks.filter(task => !task.completed);
    this.saveData();
  }

  recordDailyAccess() {
    const today = new Date().toISOString().split('T')[0];

    if (!this.data.activity[today]) {
      this.data.activity[today] = { tasks: 0, accessed: true };
    }

    this.data.lastAccess = today;
    this.saveData();
  }

  recordTaskCompletion() {
    const today = new Date().toISOString().split('T')[0];

    if (!this.data.activity[today]) {
      this.data.activity[today] = { tasks: 0, accessed: true };
    }

    this.data.activity[today].tasks += 1;
    this.saveData();
  }

  getActivityData() {
    return this.data.activity;
  }

  getStats() {
    const tasks = this.getTasks();
    const today = new Date().toISOString().split('T')[0];

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      todayTasks: tasks.filter(t => t.createdAt.startsWith(today)).length,
      streak: this.calculateStreak()
    };
  }

  calculateStreak() {
    const activity = this.getActivityData();
    const dates = Object.keys(activity).sort().reverse();
    let streak = 0;

    for (const date of dates) {
      if (activity[date].accessed) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  exportData() {
    return {
      tasks: this.getTasks(),
      activity: this.getActivityData(),
      exportedAt: new Date().toISOString()
    };
  }
}