// Configuração da API
        const API_BASE_URL = 'http://localhost:8000/api';
        
        // Elementos do DOM
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        const errorElement = document.getElementById('errorLogin');
        const loadingElement = document.getElementById('loadingLogin');

        // Função para mostrar mensagem de erro
        function showError(message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Função para esconder mensagem de erro
        function hideError() {
            errorElement.style.display = 'none';
        }

        // Função para fazer login
        async function login() {
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            
            if (!email || !senha) {
                showError('Por favor, preencha todos os campos.');
                return;
            }
            
            hideError();
            loadingElement.style.display = 'block';
            loginBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: email,  // Ou 'email' dependendo do seu backend
                        password: senha
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access);
                    localStorage.setItem('refresh_token', data.refresh); // Opcional
                    window.location.href = 'dashboard.html';
                } else {
                    const errorData = await response.json();
                    showError(errorData.detail || 'Credenciais inválidas');
                }
            } catch (error) {
                showError('Erro de conexão com o servidor');
            } finally {
                loadingElement.style.display = 'none';
                loginBtn.disabled = false;
            }
        }

        // Event Listeners
        loginBtn.addEventListener('click', login);
        
        // Permitir login ao pressionar Enter
        senhaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('registered') === 'true') {
            showAlert('success', 'Registro realizado com sucesso! Faça login para continuar.');
        }

        // Verifique se há parâmetros de erro na URL
        const urlParas = new URLSearchParams(window.location.search);
        if (urlParas.get('error') === 'session_expired') {
            showError('Sua sessão expirou. Por favor, faça login novamente.');
        }