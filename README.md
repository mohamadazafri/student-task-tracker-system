# Student Task Tracker System

A comprehensive task management system built with Vue.js and PHP, designed to help students track and manage their academic tasks effectively.

## Features

- 📊 Interactive Dashboard with task statistics and charts
- 📝 Task Management (Create, Read, Update, Delete)
- 📅 Due Date Tracking
- 🎯 Task Status Management
- 📱 Responsive Design
- 📈 Visual Analytics
- 🔍 Task Filtering and Sorting

## Prerequisites

- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL (v5.7 or higher)
- Web Server (Apache/Nginx)
- Composer (PHP package manager)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student-task-tracker-system
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run serve
```

### 3. Backend Setup

1. **Database Configuration**

   - Create a new MySQL database named `student_task_tracker`
   - Import the database schema:
     ```bash
     mysql -u root -p student_task_tracker < api/database.sql
     ```

2. **PHP Configuration**

   - Update database credentials in `api/config.php`:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     define('DB_NAME', 'student_task_tracker');
     ```

3. **Web Server Configuration**
   - Configure your web server (Apache/Nginx) to point to the project directory
   - Ensure the `api` directory is accessible via web server
   - For Apache, make sure `mod_rewrite` is enabled

### 4. Environment Setup

1. **Frontend Environment**

   - The API endpoint is configured in `src/services/api.js`
   - Default URL: `http://localhost/student-task-tracker-system/api`
   - Update the `API_URL` constant if your setup differs

2. **Backend Environment**
   - Ensure PHP has write permissions for the project directory
   - Enable required PHP extensions:
     - PDO
     - PDO_MySQL
     - mod_rewrite (for Apache)

## Project Structure

```
student-task-tracker-system/
├── api/                    # Backend API
│   ├── config.php         # Database and API configuration
│   ├── tasks.php          # Task API endpoints
│   ├── database.sql       # Database schema
│   └── .htaccess          # URL rewriting rules
├── src/                    # Frontend source
│   ├── components/        # Vue components
│   ├── services/          # API services
│   └── App.vue           # Main application component
├── public/                # Static assets
└── package.json          # Frontend dependencies
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Development

### Frontend Development

```bash
# Start development server
npm run serve

# Build for production
npm run build
```

### Backend Development

- The API is built with PHP and uses PDO for database operations
- CORS is enabled for cross-origin requests
- Error handling and input validation are implemented

## Troubleshooting

1. **Database Connection Issues**

   - Verify database credentials in `api/config.php`
   - Ensure MySQL service is running
   - Check database user permissions

2. **API Connection Issues**

   - Verify API URL in `src/services/api.js`
   - Check web server configuration
   - Ensure PHP is properly configured

3. **CORS Issues**
   - Verify CORS headers in `api/config.php`
   - Check browser console for CORS errors
   - Ensure proper domain configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Vue.js for the frontend framework
- Chart.js for data visualization
- BootstrapVue for UI components
