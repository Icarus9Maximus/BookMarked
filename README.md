# BookMarked

BookMarked is a web application that allows users to read prepared notes of books that are already in the database. Users can search and sort books based on different criteria, but they do not have the freedom to create their own books. This project is built using JavaScript, PostgreSQL, EJS, Bootstrap, and CSS.

## Features

- **Read Prepared Notes**: Access and read notes for a variety of books already stored in the database.
- **Search Books**: Easily search for books using the search functionality.
- **Sort Books**: Sort books based on different criteria such as title, author, or date read.
- **Responsive Design**: A user-friendly interface that works seamlessly on both desktop and mobile devices.

## Technologies Used

- **JavaScript**: Provides the interactive elements of the application.
- **PostgreSQL**: Manages the database of books and notes.
- **EJS (Embedded JavaScript)**: Templating engine used for rendering dynamic content.
- **Bootstrap**: Ensures a responsive and modern design.
- **CSS**: Custom styling for enhancing the visual appeal of the application.

## Installation

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/yourusername/BookMarked.git
    cd BookMarked
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Set Up PostgreSQL Database**:
    - Ensure PostgreSQL is installed and running.
    - Create a database named `bookMarked`.
    - Update the database configuration in your `.env` file.

4. **Run the Application**:
    ```sh
    node app.js or nodemon app.js
    ```

5. **Access the App**:
    Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Home Page**: View a list of books with their notes.
- **Search**: Use the search bar to find specific books.
- **Sort**: Use the sorting options to organize the book list.

## Contributing

If you'd like to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature/your-feature
    ```
3. Commit your changes:
    ```sh
    git commit -m "Add some feature"
    ```
4. Push to the branch:
    ```sh
    git push origin feature/your-feature
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

