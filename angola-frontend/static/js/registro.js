// Configuração da API
        const API_BASE_URL = 'http://localhost:8000/api';
        
        // Elementos do DOM
        const registerBtn = document.getElementById('registerBtn');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const password2Input = document.getElementById('password2');
        const errorElement = document.getElementById('errorRegister');
        const loadingElement = document.getElementById('loadingRegister');

        // Função para mostrar mensagem de erro
        function showError(message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Função para esconder mensagem de erro
        function hideError() {
            errorElement.style.display = 'none';
        }

        // Função para validar os campos
        function validateFields() {
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const password2 = password2Input.value.trim();
            
            if (!username || !email || !password || !password2) {
                showError('Por favor, preencha todos os campos.');
                return false;
            }
            
            if (password !== password2) {
                showError('As senhas não coincidem.');
                return false;
            }
            
            if (password.length < 8) {
                showError('A senha deve ter pelo menos 8 caracteres.');
                return false;
            }
            
            return true;
        }

        // Função para registrar o usuário
        async function register() {
        if (!validateFields()) {
            return;
        }
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        hideError();
        loadingElement.style.display = 'block';
        registerBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    password2: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Registro bem-sucedido
                window.location.href = 'login.html?registered=true';
            } else {
                // Mostra erros de validação do servidor
                let errorMessage = 'Erro ao registrar. Verifique os dados.';
                
                if (data.username) {
                    errorMessage = data.username[0];
                } else if (data.email) {
                    errorMessage = data.email[0];
                } else if (data.password) {
                    errorMessage = data.password[0];
                } else if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                }
                
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Erro:', error);
            showError('Erro de conexão com o servidor. Tente novamente.');
        } finally {
            loadingElement.style.display = 'none';
            registerBtn.disabled = false;
        }
    }

        // Event Listeners
        registerBtn.addEventListener('click', register);
        
        // Permitir registro ao pressionar Enter
        password2Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                register();
            }
        });