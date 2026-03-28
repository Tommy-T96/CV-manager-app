# CV Manager - React Native

A cross-platform mobile application for managing, parsing, and querying CVs.

## Features

- Upload and parse CVs (PDF, Word, plain text)
- Extract structured data from CVs
- Search CVs by various criteria
- Natural language querying of CV data
- Tag and organize CVs
- Export and import CV data

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- React Native development environment set up

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/cv-manager.git
cd cv-manager
```

2. Install dependencies
```
npm install
# or
yarn install
```

3. Start the Metro bundler
```
npm start
# or
yarn start
```

4. Run on Android
```
npm run android
# or
yarn android
```

5. Run on iOS
```
npm run ios
# or
yarn ios
```

6. Run on Windows (requires React Native for Windows setup)
```
npm run windows
# or
yarn windows
```

## Project Structure

- `/src` - Main source code
  - `/components` - Reusable UI components
  - `/screens` - Application screens
  - `/navigation` - Navigation configuration
  - `/hooks` - Custom React hooks
  - `/utils` - Utility functions
  - `/constants` - App constants
  - `/types` - TypeScript type definitions
  - `/mocks` - Mock data for development

## Windows Compatibility

This application is designed to work on Windows devices through React Native for Windows. To set up the Windows development environment, follow the [official React Native for Windows documentation](https://microsoft.github.io/react-native-windows/docs/getting-started).

## License

This project is licensed under the MIT License - see the LICENSE file for details.