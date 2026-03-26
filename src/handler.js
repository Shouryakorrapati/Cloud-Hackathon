const db = require('./db') 
const {
  ScanCommand,
  PutCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const TABLE = "Books";

// GET books
module.exports.getBooks = async () => {
  const data = await db.send(new ScanCommand({ TableName: TABLE }));
  return { statusCode: 200, body: JSON.stringify(data.Items) };
};

// ADD book
module.exports.addBook = async (event) => {
  const body = JSON.parse(event.body);

  const newBook = {
    id: Date.now().toString(),
    title: body.title,
    available: true
  };

  await db.send(new PutCommand({
    TableName: TABLE,
    Item: newBook
  }));

  return { statusCode: 201, body: JSON.stringify(newBook) };
};

// BORROW
module.exports.borrowBook = async (event) => {
  const id = event.pathParameters.id;

  await db.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: "set available = :val",
    ExpressionAttributeValues: { ":val": false }
  }));

  return { statusCode: 200, body: "Book borrowed" };
};

// RETURN
module.exports.returnBook = async (event) => {
  const id = event.pathParameters.id;

  await db.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: "set available = :val",
    ExpressionAttributeValues: { ":val": true }
  }));

  return { statusCode: 200, body: "Book returned" };
};