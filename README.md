# 🚀 Blog App 🌐

This is a **Full Stack Blog Application** With Role Bases Access Control. User can signup with either User or Admin role. Admin can have access to a Blog Management tab where admin can perform CRUD operations on its own blog. Users can only see the blogs tab where all blogs will be available in paginated format. The blogs can be filtered with title and date of creation. Proper access control has been implemented in both backend and frontend through **Guards**.

## Tech Stack 🛠️

- **FRONTEND:** **ReactJs**, **Typescript**, **Tailwind CSS**, **Material-UI (MUI)**.
- **BACKEND:** **Node.js**, **Express.js**, **MongoDB**.
- **AUTHENTICATION:** **JWT (JSON Web Tokens)**.
- **ROLE-BASED ACCESS CONTROL (RBAC):** Admins and Users have different permissions.

---

## Features ✨

### **Authentication and Authorization**
- **Login and Signup** with email and password.
- **Role-based access control (RBAC):**
  - **Admin**: Can create, update, delete, and view all its blog posts.
  - **User**: Can view only blog posts.
- **Input validation** for all forms (e.g., email, password, blog content).
- **Authorization** only admin can access the blog management tab, users can only access the blog tab.

### **Blog Management**
- **Create Blog**: Admin can create new blog posts with a title, content, and category.
- **Edit Blog**: Admin can update their own blog posts.
- **Delete Blog**: Admin can delete their own blog posts.
- **View All Blogs**: A paginated list of all blog posts is available.
- **View Single Blog**: Users and Admin can read a specific blog post.
- **Search and Filter**: Users and Admin can search for blog posts by title and sort by date.

### **Category Management**
- **Predefined Categories**: Blog posts are categorized (e.g., Technology, Health, Travel).
- **Dynamic Category Selection**: Admins can select a category when creating or editing a blog post.

### **User Experience**
- **Responsive UI**: The application is fully responsive and works on all devices.
- **Loading States**: Loading indicators are shown during API requests.
- **Error Handling**: Proper error messages are displayed for invalid inputs or failed API requests.


## Installation 🛠️

Follow these steps to set up the Github User Repo Explorer on your local machine:

- **Clone the repository.**
```bash
git clone https://github.com/absiemon/blog-app.git
```
- **Move to the project directory.**
```bash
cd yourProjectDirName
```
- **Install required packages.**
```bash
cd client
npm install

cd server
npm install
```

- **Naviage to server, create env file and add your credentials into it**
```bash
NODE_ENV: 'DEVELOPMENT || PRODUCTION'
JWT_SECRET: 'YOUR_JWT_SECRET'
MONGO_URI: 'YOUR_MONGO_URI'
AWS_ACCESS_KEY_ID: 'YOUR_AWS_ACCESS_KEY_ID'
AWS_REGION: 'YOUR_AWS_REGION'
AWS_BUCKET_NAME: 'YOUR_AWS_BUCKET_NAME'
PROD_COOKIE_DOMAIN: 'YOUR_PROD_COOKIE_DOMAIN'
SESSION_SECRET_KEY: 'YOUR_SESSION_SECRET_KEY'
VERIFICATION_TOKEN_SEC_KEY: 'YOUR_VERIFICATION_TOKEN_SEC_KEY'
COOKIE_SECRET_KEY: 'YOUR_COOKIE_SECRET_KEY'
SESSION_SECRET_KEY: 'YOUR_SESSION_SECRET_KEY'
SMTP_USER_EMAIL: 'YOUR_SMTP_USER_EMAIL'
SMTP_USER_PASSWORD: 'YOUR_SMTP_USER_PASSWORD'
```

- **Naviage to CLIENT, create env file and add your credentials into it**
```bash
VITE_MODE: 'DEVELOPMENT || PRODUCTION'
VITE_API_BASE_URL: 'VITE_API_BASE_URL'
```

- **Run the app.**
```bash
cd client
npm run dev
cd ..
cd server
npm run dev
```


- **Get a demo at below url to get the last booking detail.**
```bash

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

