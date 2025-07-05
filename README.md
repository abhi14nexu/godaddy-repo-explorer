# GoDaddy Repository Explorer

A modern React application for exploring GoDaddy's public repositories on GitHub. Built with React 19, Vite, and Tailwind CSS.

## 🚀 Features

- **Repository Browsing**: View all GoDaddy repositories with comprehensive details
- **Advanced Search**: Search repositories by name or description
- **Language Filtering**: Filter repositories by programming language
- **Sorting Options**: Sort by name, stars, forks, or last updated
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Loading States**: Animated loading indicators with progress feedback
- **Repository Details**: Detailed view with statistics, languages, and metadata

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Clone the Repository

```bash
git clone https://github.com/your-username/godaddy-repo-explorer.git
cd godaddy-repo-explorer
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

### Main Features

1. **Repository List**: Browse all GoDaddy repositories on the homepage
2. **Search**: Use the search bar to find specific repositories
3. **Filter**: Select languages from the dropdown to filter repositories
4. **Sort**: Choose sorting criteria (name, stars, forks, updated)
5. **Repository Details**: Click on any repository to view detailed information

### Navigation

- **Home (`/`)**: Repository list with search and filters
- **Repository Details (`/repository/:name`)**: Individual repository information

## 🏗 Architecture

The application follows a modern React architecture with:

- **Component-Based Design**: Reusable UI components
- **Custom Hooks**: Business logic abstraction
- **Service Layer**: API integration and data transformation
- **Client-Side Routing**: React Router for navigation
- **State Management**: React hooks for local state

### Key Design Patterns

- **Separation of Concerns**: Components, hooks, and services are clearly separated
- **Error Boundaries**: Comprehensive error handling at all levels
- **Loading States**: Consistent loading indicators throughout the app
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Technology Stack

### Frontend
- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework

### Data & API
- **Axios**: HTTP client for API requests
- **GitHub API**: Repository data source

### Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers



## Technology Decisions

### Why These Libraries Were Chosen

#### **Axios vs Fetch**
- **Choice**: Axios
- **Reasons**: 
  - Built-in JSON parsing and error handling
  - Request/response interceptors for centralized error handling
  - Better TypeScript support and IDE intellisense
  - Automatic request/response transformation
  - Built-in timeout and request cancellation
  - More consistent API across different browsers

#### **Vite vs Create React App**
- **Choice**: Vite
- **Reasons**:
  - Significantly faster development server startup (< 1s vs 10-30s)
  - Lightning-fast hot module replacement (HMR)
  - Optimized production builds with Rollup
  - Native ES modules support
  - Better performance with large codebases
  - More flexible configuration options
  - Active development and modern architecture

#### **Tailwind CSS vs Other CSS Frameworks**
- **Choice**: Tailwind CSS
- **Rationale**:
  - Utility-first approach enables rapid prototyping
  - Consistent design system built-in
  - Excellent developer experience with IntelliSense
  - Automatic purging of unused CSS in production
  - Highly customizable without bloated components
  - Better maintainability than custom CSS
  - Responsive design made simple with breakpoint prefixes

#### **Vitest vs Jest**
- **Choice**: Vitest
- **Rationale**:
  - Native Vite integration with shared configuration
  - Faster test execution (up to 10x faster than Jest)
  - Built-in TypeScript support without additional setup
  - Watch mode with instant feedback
  - Better ES modules support
  - Compatible with Jest API for easy migration
  - Integrated coverage reporting

## 🔌 API Integration

The application integrates with the GitHub API to fetch repository data:

### Endpoints Used

- **Organizations Repositories**: `GET /orgs/godaddy/repos`
- **Repository Details**: `GET /repos/godaddy/:repo`
- **Repository Languages**: `GET /repos/godaddy/:repo/languages`

### API Features

- **Pagination**: Automatically fetches all repositories across multiple pages
- **Rate Limiting**: Handles GitHub API rate limits gracefully(60 per hour)
- **Error Handling**: Comprehensive error handling for API failures
- **Data Transformation**: Converts API responses to consistent format

For production use, consider implementing authentication.

## 🧪 Testing

The project includes comprehensive testing coverage:

### Test Types

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Component interaction testing
- **Service Tests**: API service testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage

The test suite covers:
- All React components
- Custom hooks
- API services
- Error handling
- User interactions

### Test Structure

```
__tests__/
├── components/          # Component tests
├── hooks/              # Hook tests
└── services/           # Service tests
```

## 🚀 Development

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```


