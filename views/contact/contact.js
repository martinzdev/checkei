function contactForm() {
  return {
    form: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    errors: {},
    isValid: {},
    isSubmitting: false,
    showSuccessMessage: false,

    validateField(field) {
      delete this.errors[field];
      this.isValid[field] = false;

      if (field === 'name') {
        if (!this.form.name.trim()) {
          this.errors.name = 'Nome é obrigatório';
          return false;
        }
        if (this.form.name.trim().length < 2) {
          this.errors.name = 'Nome deve ter pelo menos 2 caracteres';
          return false;
        }
        this.isValid.name = true;
      }

      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.form.email.trim()) {
          this.errors.email = 'Email é obrigatório';
          return false;
        }
        if (!emailRegex.test(this.form.email)) {
          this.errors.email = 'Email deve ter um formato válido';
          return false;
        }
        this.isValid.email = true;
      }

      if (field === 'subject') {
        if (!this.form.subject) {
          this.errors.subject = 'Assunto é obrigatório';
          return false;
        }
        this.isValid.subject = true;
      }

      if (field === 'message') {
        if (!this.form.message.trim()) {
          this.errors.message = 'Mensagem é obrigatória';
          return false;
        }
        if (this.form.message.trim().length < 10) {
          this.errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
          return false;
        }
        if (this.form.message.length > 500) {
          this.errors.message = 'Mensagem deve ter no máximo 500 caracteres';
          return false;
        }
        this.isValid.message = true;
      }

      return true;
    },

    validateAll() {
      const fields = ['name', 'email', 'subject', 'message'];
      let isFormValid = true;

      fields.forEach(field => {
        if (!this.validateField(field)) {
          isFormValid = false;
        }
      });

      return isFormValid;
    },

    async submitForm() {
      if (!this.validateAll()) {
        return;
      }

      this.isSubmitting = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.showSuccessMessage = true;

        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
        this.errors = {};
        this.isValid = {};

        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);

      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}