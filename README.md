# MyNoteControl Backend

Este é o backend do sistema **MyNoteControl**, uma solução para controle de notebooks, empréstimos e devoluções, desenvolvido com Django e Django REST Framework.

## Sobre o projeto

O MyNoteControl foi idealizado por [@annacriativars2](https://github.com/annacriativars2) e tem como objetivo facilitar a gestão de equipamentos de informática, permitindo o cadastro, acompanhamento e relatórios de notebooks, usuários e movimentações.

## Principais funcionalidades

- Cadastro, listagem, edição e exclusão de notebooks
- Controle de empréstimos e devoluções
- Relatórios de equipamentos disponíveis, emprestados e vencidos
- Autenticação JWT para segurança da API
- Integração com banco de dados PostgreSQL

## Tecnologias utilizadas

- Python 3.11+
- Django 4.2+
- Django REST Framework
- PostgreSQL
- Docker/Docker Compose

## Como rodar o projeto

1. **Configure o banco de dados PostgreSQL**  
   O backend espera um banco rodando em `localhost:5432` com:
   - Nome: `default-db`
   - Usuário: `user`
   - Senha: `passwd`

2. **Instale as dependências**
   ```bash
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

## Endpoints principais

- `/api/notebooks/` - CRUD de notebooks
- `/api/emprestimos/` - CRUD de empréstimos
- `/api/users/` - CRUD de usuários
- `/api/auth/token/` - Autenticação JWT

## Licença

Projeto para fins acadêmicos e institucionais.

---

Idealizado por [@annacriativars2](https://github.com/annacriativars2)