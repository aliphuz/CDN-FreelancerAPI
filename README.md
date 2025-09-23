# CDN FreelancerAPI

A Clean Architecture ASP.NET Core Web API for managing freelancers at Complete Developer Network (CDN).

## Architecture

This project follows Clean Architecture principles with the following layers:

- **Domain**: Core business entities and domain logic
- **Application**: Use cases, interfaces, DTOs, and validation
- **Infrastructure**: Data access implementation using Dapper
- **WebAPI**: Controllers and API configuration

## Technology Stack

- ASP.NET Core 8.0 Web API
- Dapper ORM (no Entity Framework)
- SQL Server
- xUnit for testing
- FluentValidation
- Swagger/OpenAPI

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CDN.FreelancerAPI
   ```

2. **Create the database**
   - Run the SQL script in `database-schema.sql` to create the database and tables
   - Update the connection string in `appsettings.json` if needed

3. **Build the solution**
   ```bash
   dotnet build
   ```

4. **Run tests**
   ```bash
   dotnet test
   ```

5. **Run the API**
   ```bash
   cd src/WebAPI
   dotnet run
   ```

6. **Access Swagger UI**
   - Navigate to `https://localhost:7xxx/swagger` (port may vary)

## API Endpoints

- `POST /api/freelancers` - Create a new freelancer
- `GET /api/freelancers/{id}` - Get freelancer by ID
- `GET /api/freelancers` - Get all freelancers (with pagination)
- `GET /api/freelancers/search?keyword=...` - Search freelancers
- `PUT /api/freelancers/{id}` - Update freelancer
- `DELETE /api/freelancers/{id}` - Delete freelancer
- `PATCH /api/freelancers/{id}/archive` - Archive/unarchive freelancer

## Features

- ✅ Clean Architecture implementation
- ✅ Dapper ORM with raw SQL queries
- ✅ Repository pattern
- ✅ FluentValidation for input validation
- ✅ Global error handling middleware
- ✅ Pagination support
- ✅ Unit tests with mocking
- ✅ Swagger documentation
- ✅ CI/CD pipeline (GitHub Actions)

## Project Structure

```
CDN.FreelancerAPI/
├── src/
│   ├── Domain/
│   │   └── Entities/
│   ├── Application/
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   ├── UseCases/
│   │   └── Validators/
│   ├── Infrastructure/
│   │   └── Repositories/
│   └── WebAPI/
│       ├── Controllers/
│       └── Middleware/
├── tests/
│   └── UnitTests/
├── database-schema.sql
└── README.md
```

## Database Schema

The application uses three main tables:
- **Freelancers**: Core freelancer information
- **Skillsets**: Freelancer skills (one-to-many)
- **Hobbies**: Freelancer hobbies (one-to-many)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request