import { keyInSelect, question } from "readline-sync";
import { Book } from "./book.js";
import { booksData } from "../data/data.js";
import { Helper } from "./helper.js";
export class Program {
  constructor() {
    this.books = [];
    this.helpderValidator = new Helper();
    this.loadData(booksData);
  }

  loadData(data) {
    for (let e of data) {
      const newBook = new Book(e);
      this.books.push(newBook);
    }
  }

  printMenu() {
    console.log("========== Menu ==========");
    console.log("1. Filter books by publisher.");
    console.log("2. Find books by name.");
    console.log("3. Sort by Price.");
    console.log("4. Add one or more new book.");
    console.log("5. Remove one or more new book.");
    console.log("6. Update a book data");
    console.log("========== Choose ============");
  }

  #getChoice() {
    let choice = Number(question("Enter feature (Nhap so 0 de dung): "));
    let result = "";
    console.clear();
    switch (choice) {
      case 1:
        let providerName = question("Enter provider name: ");
        result = this.#filterByProvider(providerName);
        result.length ? console.log(result) : console.log("No book found.");
        break;
      case 2:
        let bookName = question("Enter book name: ");
        result = this.#searchByName(bookName);
        result.length ? console.log(result) : console.log("No book found.");
        break;
      case 3:
        result = this.#sortByPrice();
        console.log("Sorted book list: ");
        console.log(result);
        break;
      case 4:
        // enter new book info
        let numbAddingBook = Number(
          question("Enter number of book to add: ", {
            limit: (val) => this.helpderValidator.isPositiveNumber(val),
            limitMessage: "Number of book to add mustn't be a negative number",
          })
        );
        if (numbAddingBook > 0) {
          let count = 1;
          while (count <= numbAddingBook) {
            console.log(
              `================= New book number ${count} data: =====`
            );
            let newBook = new Book({
              id: "",
              name: "",
              price: 0,
              provider: "",
            });
            newBook._id = Number(
              question("Enter new book id: ", {
                limit: (val) => this.helpderValidator.isPositiveNumber(val),
                limitMessage: "Book id must be greater or equal to 0",
              })
            );
            newBook._name = question("Enter new book name: ", {
              limit: (val) => !this.helpderValidator.isEmptyString(val),
              limitMessage: "Book name must not be empty",
            });
            newBook._price = Number(
              question("Enter new book price: ", {
                limit: (val) => this.helpderValidator.isPositiveNumber(val),
                limitMessage: "Book price must be greater or equal to 0",
              })
            );
            newBook._provider = question("Enter new book provider: ");
            // check if bookId already exist
            if (this.#getIdxById(newBook._id) !== -1) {
              console.log("Book id already exist!");
              continue;
            }
            this.#addBook(newBook);

            count++;
            console.log("================= End =====");
          }
        }

        console.log("Booklist after add new book(s)");
        console.log(this.books);
        break;
      case 5:
        let numbDeleteBook = Number(
          question("Enter number of book: ", {
            limit: (val) => this.helpderValidator.isPositiveNumber(val),
            limitMessage:
              "Number of book to delete mustn't be a negative number",
          })
        );
        if (numbDeleteBook > 0) {
          let count = 1;
          while (count <= numbDeleteBook) {
            console.log(
              `================= Book number ${count} to delete: =====`
            );
            let bookId = Number(
              question("Enter book id to delete: ", {
                limit: (val) => this.helpderValidator.isPositiveNumber(val),
                limitMessage: "Book id must be greater or equal to 0",
              })
            );
            let bookIdx = this.#getIdxById(bookId);
            if (bookIdx === -1) {
              console.log("Book not found!");
              console.log("Next Id please");
              continue;
            }
            result = this.#removeBook(bookIdx);
            if (result.length === 0) {
              console.log("Book not found!");
              console.log("Next Id please");
              continue;
            } else {
              console.log(
                `Book with info: "${result[0]["_id"]} ${result[0]["_name"]}" is removed from array`
              );
            }
            count++;
            console.log("================= End =====");
          }
        }
        console.log("Booklist after remove book(s)");
        console.log(this.books);
        break;
      case 6:
        let bookId = Number(
          question("Enter book id to update: ", {
            limit: (val) => this.helpderValidator.isPositiveNumber(val),
            limitMessage: "Book id must be greater or equal to 0",
          })
        );

        // check if bookId exist
        let bookIdx = this.#getIdxById(bookId);
        if (bookIdx === -1) {
          console.log("Book not found!");
          return;
        }

        console.log("Current data: ");
        console.log(this.books[bookIdx]);

        // update the book
        this.#updateBookHandler(bookIdx);
        break;
      default:
        console.log("Wrong choice!");
        break;
    }
  }

  #filterByProvider(providerName) {
    // validation
    if (this.books.length === 0) return;
    return this.books.filter(({ _provider }) =>
      _provider.toLowerCase().includes(providerName.toLowerCase().trim())
    );
  }

  #searchByName(bookName) {
    if (this.books.length === 0) return;
    return this.books.filter(({ _name }) =>
      _name.toLowerCase().includes(bookName.toLowerCase().trim())
    );
  }

  #sortByPrice() {
    if (this.books.length === 0) return;
    let orderChoice = [0, 1];
    let chosenOrderChoice = keyInSelect(orderChoice, "Enter sort choice: ");

    // create a copy of book data
    let tempBookData = JSON.parse(JSON.stringify(this.books));

    if (chosenOrderChoice === 0) {
      return tempBookData.sort((a, b) => a._price - b._price);
    }

    return tempBookData.sort((a, b) => b._price - a._price);
  }

  #getIdxById(bookId) {
    if (this.books.length === 0) return;
    return this.books.findIndex(({ _id }) => _id === bookId);
  }

  #addBook(newBookArr = []) {
    if (newBookArr.length === 0) return;
    // push into array
    this.books.push(newBookArr);
  }

  #removeBook(bookIdx) {
    if (bookIdx === -1) return;
    return this.books.splice(bookIdx, 1);
  }

  #updateBookHandler(bookIdx) {
    let choice = ["name", "price", "provider"];
    let chosenChoice = keyInSelect(choice, "Enter book data to update: ");
    switch (chosenChoice) {
      case 0:
        this.#updateBookName(bookIdx);
        break;
      case 1:
        this.#updateBookPrice(bookIdx);
        break;
      case 2:
        this.#updateBookProvider(bookIdx);
        break;
      default:
        break;
    }

    console.log('Book data after update');
    console.log(this.books[bookIdx]);
  }

  #updateBookName(bookIdx) {
    if (bookIdx === -1) return;
    let newBookName = question("Enter new book name: ", {
      limit: (val) => !this.helpderValidator.isEmptyString(val),
      limitMessage: "Book name must not be empty",
    });
    this.books[bookIdx]["_name"] = newBookName;
  }

  #updateBookPrice(bookIdx) {
    if (bookIdx === -1) return;
    let newBookPrice = Number(
      question("Enter new book price: ", {
        limit: (val) => this.helpderValidator.isPositiveNumber(val),
        limitMessage: "Book price must be greater or equal to 0",
      })
    );
    this.books[bookIdx]["_price"] = newBookPrice;
  }

  #updateBookProvider(bookIdx) {
    if (bookIdx === -1) return;
    let newBookProvider = question("Enter new book name: ");
    this.books[bookIdx]["_provider"] = newBookProvider;
  }

  run() {
    // print menu

    this.printMenu();
    this.#getChoice();
  }
}
