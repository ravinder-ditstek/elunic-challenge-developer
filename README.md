# elunic Developer Challenge

## Development Environment

You can start a development environment by running the following command in the root directory:
```bash
./shell
```
The environment will be preconfigured with a MySQL database at port 3306 and phpMyAdmin at port 13079.

## Challenge: Implement Database Functionality

- Connect the backend to the MySQL database provided by the Docker development environment (see credentials in `.env.example`)
- Create a database model for "user messages"
- Create an API endpoint that accepts and stores messages from a form in the frontend
- Display all messages in the frontend in a paginated PrimeNG component (3 messages per page)
- Create 10 test messages to validate pagination functionality

Constraints/notes:
- Implement explicit database migrations (no ORM-backed implicit schema generation)
