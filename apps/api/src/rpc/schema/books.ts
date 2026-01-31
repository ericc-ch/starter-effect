import { Schema } from "effect"

// Define a book with an ID, title, and author using Schema.Class (more idiomatic)
export class Book extends Schema.Class<Book>("Book")({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  title: Schema.String,
  author: Schema.String,
}) {}

// BookInsert omits the id field (for creating new books)
export const BookInsert = Schema.Struct(Book.fields).pipe(Schema.omit("id"))

// BookUpdate makes all fields optional (for partial updates)
export const BookUpdate = Schema.partial(BookInsert)

// BookId as a standalone schema
export const BookId = Schema.Number.pipe(Schema.int(), Schema.positive())

// Types
export type BookType = Schema.Schema.Type<typeof Book>
export type BookInsertType = Schema.Schema.Type<typeof BookInsert>
export type BookUpdateType = Schema.Schema.Type<typeof BookUpdate>
export type BookIdType = Schema.Schema.Type<typeof BookId>
