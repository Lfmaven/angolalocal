# **Documentação do Projeto Angola API**

*(Versão Simplificada para Facilitar a Execução do Projecto)*

---

## **📋 1. Requisitos do Sistema**

Antes de começar, verifique se você tem instalado:

- **Python 3.8+** ([Download Python](https://www.python.org/downloads/))
- **MySQL** ([Download MySQL](https://dev.mysql.com/downloads/))
- **Git** (Opcional, para clonar o repositório)

---

## **🚀 2. Configuração Inicial**

### **🔹 Passo 1: Clonar o Repositório (ou Baixar o Código)**

```bash
git clone [URL_DO_REPOSITÓRIO]  
cd angola_api  
```

### **🔹 Passo 2: Criar um Ambiente Virtual (Recomendado)**

```bash
python -m venv venv  
source venv/bin/activate  # Linux/Mac  
venv\Scripts\activate    # Windows  
```

### **🔹 Passo 3: Instalar Dependências**

```bash
pip install -r requirements.txt  
```

---

## **🛠 3. Configurar o Banco de Dados**

### **🔹 Passo 1: Criar um Banco de Dados no MySQL**

```sql
CREATE DATABASE angolalocal;
```

### **🔹 Passo 2: Configurar `settings.py`**

Verifique se as configurações do banco de dados estão corretas:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'angolalocal',      # Nome do banco de dados
        'USER': 'root',             # Seu usuário MySQL
        'PASSWORD': '',             # Sua senha MySQL (vazia se não tiver)
        'HOST': 'localhost',        # Ou IP do servidor
        'PORT': '3306',             # Porta padrão do MySQL
    }
}
```

### **🔹 Passo 3: Aplicar Migrações**

```bash
python manage.py migrate
```

### **🔹 Passo 4: Criar um Superusuário (Opcional, para acessar o Admin)**

```bash
python manage.py createsuperuser
```

*(Preencha os dados quando solicitado.)*

---

## **⚡ 4. Executar o Projeto**

### **🔹 Iniciar o Servidor**

```bash
python manage.py runserver
```

➡ **Acesse:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## **🔐 5. Testar a API**

### **🔹 1. Documentação Interativa (Swagger UI)**

Acesse:

- **Swagger:** [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
- **ReDoc:** [http://127.0.0.1:8000/redoc/](http://127.0.0.1:8000/redoc/)

### **🔹 2. Registrar um Usuário**

**Endpoint:** `POST /api/register/`
**Exemplo de Corpo (JSON):**

```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
}
```

### **🔹 3. Obter Token JWT (Login)**

**Endpoint:** `POST /api/token/`
**Exemplo de Corpo (JSON):**

```json
{
    "username": "testuser",
    "password": "123456"
}
```

➡ **Retorna:**

```json
{
    "refresh": "xxxxx",
    "access": "xxxxx"
}
```

### **🔹 4. Acessar Dados Protegidos**

- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Exemplo:**
  - Listar províncias: `GET /api/provincias/`
  - Filtrar municípios: `GET /api/municipios/?provincia=1`

---

## **❓ 6. Solução de Problemas**

| **Problema**            | **Solução**                                                          |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Erro ao conectar ao MySQL     | Verifique usuário/senha no `settings.py`                                  |
| Migrações falhando          | Execute `python manage.py makemigrations` antes de `migrate`             |
| CORS bloqueando requisições | Garanta que `CORS_ALLOW_ALL_ORIGINS = True` está ativo em desenvolvimento |
