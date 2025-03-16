### Setting up the Project on Local Machine

#### Pre-requisites

- Node.js
- NPM
- MongoDB (if required by the project)

###### 1. Clone the GitHub repository to your local machine

```bash
git clone https://github.com/omkar273/mahayojana-backend.git
```

###### 2. Navigate to the cloned directory

```bash
cd mahayojana-backend
```

###### 3. Install all dependencies using npm

```bash
npm install
```

###### 4. Setup Environment Variables

- Create a `.env` file in the root directory.
- Copy the contents of `env.sample` into `.env`.
- Fill in the required environment variables such as MongoDB connection string, JWT secret, and any other required configurations.

###### 5. Run the Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:8082`.

### Branch Naming Convention

Maintaining consistent branch naming helps in better collaboration and code management.

#### Format

```bash
<prefix>/<branch_name>/<developer_name>
```

**Prefixes:**

- `feature`: New features or enhancements.
- `task`: Modifications or code refactoring.
- `bug`: Bug fixes.

**Branch Name:**
- A descriptive name summarizing the branch purpose.

**Developer Name (Optional):**
- Your name or GitHub username.

##### Example Branch Names:

- `feature/user-authentication/omkar`
- `task/refactor-api-endpoints/omkar`
- `bug/fix-user-login/omkar`

### Commit Conventions

Clear and consistent commit messages make the project history more readable.

1. **Imperative Mood:** Use verbs like `Add`, `Fix`, `Update`.
   
   Example:
   - ✅ `Add user authentication feature`
   - ❌ `Added user authentication feature`

2. **Concise Description:** Limit the subject line to 50 characters if possible.
   
   Example:
   - ✅ `Fix JWT token expiration bug`
   - ❌ `Fixing issue related to JWT token expiration occurring in user authentication`

3. **Context in Body:** If necessary, include additional context with a blank line separating the subject and body.

   Example:
   ```
   Add JWT-based user authentication

   This commit implements JWT tokens for user authentication.
   It also includes error handling for expired tokens.
   ```

4. **Issue References:** Mention related issues or tasks.

   Example:
   - `Fix issue #123`
   - `Close task #456`

5. **Structure:**

   ```
   <subject>

   <body>

   Closes #issue_number
   ```

