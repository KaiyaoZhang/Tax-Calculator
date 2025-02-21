# Income Tax Calculator (React + TypeScript)

This is a sample React application built with TypeScript for calculating the federal income tax based on user input for a selected year. The application computes total taxes owed for the salary, taxes owed per band, and a  effective rate based on the year the user selects.

## Features

- User-friendly interface to input income and select the tax year

- Tax calculation based on the provided income and year

- Responsive and interactive UI built with React and TypeScript

- Internationalization (i18n) integrated and easier to support multi language when need in the future 

- Modular and clean component-based architecture, it's easier to handle the project's scalability and maintainability

## Tech Stack

- Programming language: TypeScript
- Framework: React.js(v18.3.1)
- UI Framework: Ant Design(v5.24.1)
- CSS: SASS
- Internationalization: i18n
- API fetching: Axios
- Unit Test: Jest, React-Testing-Lib

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KaiyaoZhang/Tax-Calculator.git
   ```

2. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

   Or

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   Or

   ```bash
   yarn start
   ```

The app will run at [`http://localhost:3000/`](http://localhost:3000/).

## Folder Structure

```
src
├── apis                # api call setup including Axios instance setup
├── features            # all the feature pages inside it
    -taxCalculator
        -__test__       # Unit tests for tax Calculator
        -components     # tax calculator components
        -index.module.scss # tax calculator styles
        -index.tsx      # tax calculator index page
        -types.ts       # types used inside tax calculator
├── styles              # Gloabl styles like responsive breakpoints
├── testWrappers        # Unit test wrapper functions
├── App.tsx             # Root component
└── index.tsx           # Entry point
```

## Testing

To run tests:

```bash
npm test
```

Or

```bash
yarn test
```


## Build

To create a production build:

```bash
npm run build
```

Or

```bash
yarn build
```


## License

This project is licensed under the [MIT License](LICENSE).