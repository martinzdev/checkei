function initApp() {
  return {
    store: null,
    tasks: [],
    newTask: '',
    filter: 'all',
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      todayTasks: 0,
      streak: 0
    },

    init() {
      this.store = new store();
      this.tasks = [...(this.store.getTasks() || [])];
      this.updateStats();
      this.store.recordDailyAccess();
    },

    loadTasks() {
      if (this.store) {
        this.tasks = this.store.getTasks() || [];
      } else {
        this.tasks = [];
      }
    },

    addTask() {
      if (this.newTask.trim() && this.store) {
        const task = this.store.addTask(this.newTask);
        if (task) {
          this.tasks = [task, ...this.tasks];
          this.newTask = '';
          this.updateStats();

          this.$nextTick(() => {
            const newTaskElement = this.$el.querySelector('.todo-item:first-child');
            if (newTaskElement) {
              newTaskElement.classList.add('animate-bounce');
            }
          });
        }
      }
    },
    toggleTask(id) {
      const task = this.tasks.find(t => t.id === id);
      if (task && this.store) {
        const wasCompleted = task.completed;
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        task.justCompleted = !wasCompleted && task.completed;

        this.store.updateTask(id, {
          completed: task.completed,
          completedAt: task.completedAt
        });

        if (task.completed && !wasCompleted) {
          this.store.recordTaskCompletion();
        }

        this.updateStats();

        if (task.justCompleted) {
          setTimeout(() => {
            task.justCompleted = false;
          }, 600);
        }
      }
    },

    editTask(id) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        const newText = prompt('Editar tarefa:', task.text);
        if (newText && newText.trim()) {
          task.text = newText.trim();
          this.store.updateTask(id, { text: task.text });
        }
      }
    },

    deleteTask(id) {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.store.deleteTask(id);
        this.updateStats();
      }
    },

    clearCompleted() {
      if (confirm('Tem certeza que deseja limpar todas as tarefas concluídas?')) {
        this.store.clearCompleted();
        this.loadTasks();
        this.updateStats();
      }
    },

    updateStats() {
      if (this.store) {
        this.stats = this.store.getStats();
      }
    },

    exportTasks() {
      const data = this.store.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `checkei-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    get filteredTasks() {
      if (!Array.isArray(this.tasks)) {
        return [];
      }

      switch (this.filter) {
        case 'pending':
          return this.tasks.filter(task => !task.completed);
        case 'completed':
          return this.tasks.filter(task => task.completed);
        default:
          return [...this.tasks];
      }
    },
  }
}
