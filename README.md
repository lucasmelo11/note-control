# MyNoteControl

Este é o sistema **MyNoteControl**, uma solução completa para controle de notebooks, empréstimos e devoluções, com frontend em React e backend em Django/Django REST Framework.

## Sobre o projeto

O MyNoteControl foi idealizado por [@annacriativars2](https://github.com/annacriativars2) e tem como objetivo facilitar a gestão de equipamentos de informática, permitindo o cadastro, acompanhamento e relatórios de notebooks, usuários e movimentações.

## Estrutura do projeto

```
mynotecontrol_v2/
├── frontend/   # Aplicação React
├── backend/    # API Django/DRF
└── README.md   # Este arquivo
```

## Principais funcionalidades

- Cadastro, listagem, edição e exclusão de notebooks
- Controle de empréstimos e devoluções
- Relatórios de equipamentos disponíveis, emprestados, vencidos e histórico
- Autenticação JWT para segurança da API
- Integração com banco de dados PostgreSQL
- Interface web moderna e responsiva

## Tecnologias utilizadas

- **Frontend:** React, JavaScript, CSS
- **Backend:** Python 3.11+, Django 4.2+, Django REST Framework
- **Banco de dados:** PostgreSQL
- **Infraestrutura:** Docker/Docker Compose

## Como rodar o projeto

### 1. Backend (API Django)

1. **Configure o banco de dados PostgreSQL**  
   O backend espera um banco rodando em `localhost:5432` com:
   - Nome: `default-db`
   - Usuário: `user`
   - Senha: `passwd`

2. **Instale as dependências**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Execute as migrações**
   ```bash
   python manage.py migrate
   ```

4. **Crie o superusuário**
   ```bash
   python manage.py createsuperuser --username admin --email admin@example.com
   # senha: admin123
   ```

5. **Inicie o servidor**
   ```bash
   python manage.py runserver
   ```

6. **(Opcional) Rodar com Docker**
   ```bash
   docker-compose up --build
   ```

### 2. Frontend (React)

1. **Instale as dependências**
   ```bash
   cd frontend
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

3. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend/API: http://localhost:8000/api/

## Endpoints principais do backend

- `/api/notebooks/` - CRUD de notebooks
- `/api/emprestimos/` - CRUD de empréstimos
- `/api/users/` - CRUD de usuários
- `/api/auth/token/` - Autenticação JWT

## Licença

Projeto para fins acadêmicos e institucionais.

---

Idealizado por [@annacriativars2](https://github.com/annacriativars2)