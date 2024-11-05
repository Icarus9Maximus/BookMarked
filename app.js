import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import axios from "axios"; Might not have to use this 
import dotenv from "dotenv";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org";
dotenv.config();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookMarked",
    password: process.env.PASSWORD,
    port: process.env.PORT || 5432
});

// Error handling when connecting to the database
db.connect(err => {
    if (err) {
        console.error("Connection error", err.stack);
    } else {
        console.log("Connected to the database");
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        // experiment
        let currentYear = new Date().getFullYear();
        // ends here
        // Get the sorting option from the query parameter
        const sortOption = req.query.sort ? req.query.sort.toLowerCase() : "name"; // Gets the sorting option, which defaults to "name" if no sort query parameter is provided.
        const searchQuery = req.query.search || ""; // Get the search term from the query parameters, defaulting to an empty string if search is not provided
        let orderBy; // Declares a variable orderBy, which will store the SQL ordering clause based on the sortOption

        // Set the ORDER BY clause based on the sort option
        switch(sortOption) {
            case "title":
                orderBy = "name ASC";
                break;
            case "newest":
                orderBy = "date_read DESC"; // Assuming date_read is used for the newest sorting
                break;
            case "best":
                orderBy = "recommendation_score DESC";
                break;
            default:
                orderBy = "name ASC"; // Default sorting
        }

        // Initialize the query with base selection
        let query = `SELECT * FROM books`; // Initialize the SQL query to select all columns from the books table
        const queryParams = []; // queryParams is an array that will hold any dymamic parameters for the query (like the search term)

        // Add WHERE clause for search if searchQuery is provided
        if (searchQuery) {
            query += ` WHERE name ILIKE $1 OR author ILIKE $1`; // Uses ILIKE for case-insensitive search. 
            queryParams.push(`%${searchQuery}%`); // %${searchQuery}% is a pattern for partial matching, allowing results that contain the search term anywhere within name or author
        }

        // Append ORDER BY clause
        query += ` ORDER BY ${orderBy}`;

        const result = await db.query(query, queryParams); // Executes the SQL query against the database, using queryParams to replace any placeholders (like $1)

        if (result.rows.length > 0) {
            const bookData = result.rows.map(book => {
                book.date_read = new Date(book.date_read);
                book.formattedDateRead = book.date_read.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                book.coverUrl = `${API_URL}/b/ISBN/${book.isbn}-L.jpg`;
                return book;
            });

            res.render("index", { books: bookData, currentYear }); //Renders the index template, passing bookData as the books variable
        } else {
            res.render("index", { books: [] }); // If there are no results, it still renders the index template but passes an empty array for books. 
        }
    } catch (err) {
        console.log("Error executing query:", err);
        res.status(500).send("Server error"); // If an error occurs it sends a 500 response back to the client.
    }
});

app.get("/book/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);  // Corrected this line
        const result = await db.query(
            "SELECT books.id, books.name, books.author, books.isbn, books.date_read, books.recommendation_score, books.description, notes.content FROM books INNER JOIN notes ON books.id = notes.book_id WHERE books.id = $1", 
            [id]
        );
        
        const singleBook = result.rows[0];  // Get the first row from the result
        if (singleBook) {
            // Construct the cover image URL using the book's ISBN
            singleBook.coverUrl = `${API_URL}/b/ISBN/${singleBook.isbn}-L.jpg`;
            singleBook.date_read = new Date(singleBook.date_read);
            singleBook.formattedDateRead = singleBook.date_read.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

            // What this does at first is that it creates a new array containing the content columns it then goes on to filter any null values by chaining a filter method
            const notes = result.rows.map(row => row.content).filter(content => content);

            // Render the book.ejs template and pass the singleBook object
            res.render("book.ejs", { singleBook, notes });
        } else {
            // If no book is found, send a 404 response
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.log(err);  // Log the error for debugging
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});