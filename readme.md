# Angola API - Documentação

## 📌 **Tema do Projeto**

**API de Divisão Administrativa de Angola**
Uma API RESTful que fornece dados sobre as divisões administrativas de Angola (Províncias, Municípios e Comunas) com autenticação JWT.

Desenvolvido Por: Luciana Mavenda e Alfred Fernandes

---

## 🛠 **Tecnologias Utilizadas**

| Categoria                | Tecnologias                   |
| ------------------------ | ----------------------------- |
| **Backend**        | Django, Django REST Framework |
| **Autenticação** | JWT (SimpleJWT)               |
| **Banco de Dados** | MySQL                         |
| **Documentação** | Swagger (drf-yasg)            |
| **CORS**           | django-cors-headers           |
| **Filtros**        | django-filter                 |

---

## 📊 **Diagrama Simples de Entidades**

```plaintext
+-------------+       +-------------+       +-------------+
|  Província  |       |  Município  |       |   Comuna    |
+-------------+       +-------------+       +-------------+
| - id        |<----->| - id        |<----->| - id        |
| - nome      |       | - nome      |       | - nome      |
+-------------+       | - provincia |       | - municipio |
                      +-------------+       +-------------+
```

**Relacionamentos**:

- **Província** (1) → (N) **Município**
- **Município** (1) → (N) **Comuna**

---

## 🚀 **Configuração & Instruções de Teste**

### **Pré-requisitos**

- Python 3.8+
- MySQL instalado
- Django e dependências (`pip install -r requirements.txt`)

### **1. Configurar Banco de Dados**

- Crie um banco MySQL chamado `angolalocal`.
- Atualize `DATABASES` em `settings.py` se necessário.

### **2. Executar Migrações**

```bash
python manage.py makemigrations
python manage.py migrate
```

### **3. Criar Superusuário (Acesso Admin)**

```bash
python manage.py createsuperuser
```

### **4. Iniciar o Servidor**

```bash
python manage.py runserver
```

Acesse: `http://127.0.0.1:8000/`

---

## 🔐 **Autenticação & Teste da API**

### **1. Registrar um Usuário**

**Endpoint**: `POST /api/register/`
**Corpo**:

```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "senhasegura123"
}
```

### **2. Obter Token JWT**

**Endpoint**: `POST /api/token/`
**Corpo**:

```json
{
    "username": "testuser",
    "password": "senhasegura123"
}
```

**Resposta**:

```json
{
    "refresh": "xxxxx",
    "access": "xxxxx"
}
```

### **3. Acessar Endpoints Protegidos**

- **Cabeçalhos**:
  ```
  Authorization: Bearer <access_token>
  ```
- **Exemplos**:
  - `GET /api/provincias/` (Listar todas as províncias)
  - `GET /api/municipios/?provincia=1` (Filtrar municípios por província)

---

## 📚 **Documentação da API (Swagger)**

Acesse a documentação interativa em:

- **Swagger UI**: `http://127.0.0.1:8000/swagger/`
- **ReDoc**: `http://127.0.0.1:8000/redoc/`

---

## 🔧 **Permissões**

- **Somente Leitura**: Acesso público para requisições `GET`.
- **Operações de Escrita**: Exigem autenticação JWT (`POST/PUT/DELETE`).

---

## 🌟 **Funcionalidades**

✅ **Autenticação JWT**
✅ **Filtros** (por província, município)
✅ **Busca** (por nome)
✅ **Painel Admin** (`/admin/`)
✅ **Integração Frontend** (Template HTML básico)

---

## 📂 **Estrutura do Projeto**

```
angola_api/  
├── core/                 # App principal (models, views, serializers)  
│   ├── models.py         # Província, Município, Comuna  
│   ├── views.py          # ViewSets para operações CRUD  
│   └── serializers.py    # Serializers DRF  
├── angola_api/           # Configurações/urls do projeto  
└── requirements.txt      # Dependências  
angola-frontend/  
├── templates/  
└── static/
└── index.html
```

---

## 🐛 **Dicas para Depuração**

- Se o MySQL falhar, verifique as credenciais em `settings.py`.
- Use `CORS_ALLOW_ALL_ORIGINS = True` apenas em desenvolvimento.

---
