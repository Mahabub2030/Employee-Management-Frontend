# Employee Management System (EMS)

A **full-stack Employee Management System (EMS)** built with **React.js**, **Redux Toolkit**, **Tailwind CSS**, and **shadcn/ui**, designed to efficiently manage employee data with **role-based access control**.
-----
🔗 Live Demo:
https://employee-management-system-chi-bay.vercel.app/
--

## 🚀 Features

- 🔐 Role-Based Access Control (Admin, Manager, Employee)
- 👥 Employee CRUD Operations (Create, Read, Update, Delete)
- 🏢 Department & Role Management
- 📊 Centralized State Management using Redux Toolkit
- 🎨 Modern, responsive UI with Tailwind CSS & shadcn/ui
- ⚡ Fast and scalable architecture
- 🔍 Search and filter employees
- 📱 Fully responsive design

---

## 👤 User Roles & Permissions

### Admin

- Full system access
- Manage employees, roles, and departments
- Assign roles and permissions

### Manager

- View and manage assigned team members
- Update employee information
- Monitor employee status

### Employee

- View personal profile
- Update limited personal information

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **Redux Toolkit**
- **Tailwind CSS**
- **shadcn/ui**

### Backend

- REST API / Server-side logic (can be integrated)
- Authentication & Authorization (JWT / Session-based)

### Tools

- Git & GitHub
- VS Code

---

## 📂 Project Structure

```base
src/
├── components/
│ ├── ui/
│ ├── layout/
│ └── common/
├── features/
│ ├── auth/
│ ├── employees/
│ └── roles/
├── pages/
├── redux/
│ ├── store.js
│ └── slices/
├── services/
├── utils/
├── App.jsx
└── main.jsx

```
