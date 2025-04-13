# Kitchensink Microservices

This project is a migration of the JBoss EAP Kitchensink application to a Spring Boot microservices architecture with MongoDB as the database. The application is containerized with Docker for easy deployment.

## Project Structure

The project consists of the following components:

- **Service Discovery**: Eureka server for service registration and discovery
- **API Gateway**: Spring Cloud Gateway for routing and load balancing
- **Member Service**: Core service for member management with MongoDB

## Prerequisites

- Java 17+
- Maven 3.8+
- Docker and Docker Compose
- MongoDB (for local development without Docker)

## Building the Application

Each microservice can be built individually using Maven:

```bash
# Build Service Discovery
cd service-discovery
./mvnw clean package

# Build API Gateway
cd ../api-gateway
./mvnw clean package

# Build Member Service
cd ../member-service
./mvnw clean package
```

## Running with Docker Compose

The easiest way to run the entire application is using Docker Compose:

```bash
# From the kitchensink-microservices directory
docker-compose up -d
```

This will start all the services in the correct order:
1. MongoDB
2. Service Discovery
3. API Gateway
4. Member Service

## Accessing the Services

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Member Service API**: http://localhost:8080/api/members

## API Endpoints

### Member Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/members | Get all members |
| GET    | /api/members/{id} | Get member by ID |
| GET    | /api/members/email/{email} | Get member by email |
| POST   | /api/members | Create a new member |
| PUT    | /api/members/{id} | Update an existing member |
| DELETE | /api/members/{id} | Delete a member |

## Testing the API

You can test the API using curl or any API testing tool like Postman:

```bash
# Get all members
curl -X GET http://localhost:8080/api/members

# Create a new member
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890"
  }'

# Get member by ID
curl -X GET http://localhost:8080/api/members/{id}

# Update a member
curl -X PUT http://localhost:8080/api/members/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890"
  }'

# Delete a member
curl -X DELETE http://localhost:8080/api/members/{id}
```

## Monitoring

The application includes Spring Boot Actuator for monitoring:

- Health check: http://localhost:8080/actuator/health
- Service Discovery health: http://localhost:8761/actuator/health

## Scaling

To scale the Member Service horizontally:

```bash
docker-compose up -d --scale member-service=3
```

## Data Migration

For migrating data from the original JBoss EAP Kitchensink application, you would need to:

1. Export data from the relational database
2. Transform the data to fit the MongoDB document model
3. Import the data into MongoDB

## Future Enhancements

- Add authentication and authorization
- Implement distributed tracing with Spring Cloud Sleuth and Zipkin
- Add centralized logging with ELK stack
- Implement caching with Redis
- Set up CI/CD pipeline for automated deployment
