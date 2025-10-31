# Cornfield Todo Application

A fully dockerized **Todo application** built with a **Laravel backend** and **React frontend**, featuring task creation, completion tracking, filtering, and drag-and-drop reordering.

---

## 🚀 Features

- Add, update, toggle status, and delete todos  
- Filter by **All**, **Active**, or **Completed**  
- Clear all completed todos  
- Drag and drop to reorder items  
- API built with **Laravel**  
- Frontend built with **React + React Query + React DnD**  
- Fully containerized using **Docker Compose**

## 🐳 Running the Application

Make sure you have **Docker** and **Docker Compose** installed.

### Start all containers
```bash
docker compose up --build
```

### This will start:
- Backend (Laravel) → http://localhost:9000
- Frontend (React) → http://localhost:5172

### API Documentation

The Postman collection is available in the root directory:
**Cornfield Todo API Documentation.postman_collection.json**

Import it into Postman to explore and test all available endpoints.

### Testing
To test the backend application
```bash
cd backend
```
Run backend test
```bash
php artisan test
```

### Disclaimer
Since this is a test assessment, env are present in the repo. To go **PROD**, advised not to directly include env in the repo.