#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categs = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');
    
    await createCategs();
    await createItems();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

async function itemCreate(index, name, desc, categ, price, num) {
    const item = new Item({ name, description: desc, category: categ, price, number_in_stock: num });
    await item.save();

    items[index] = item;
}

async function categCreate(index, name, desc) {
    const categdetail = { name, description: desc };
    const categ = new Category(categdetail);
    await categ.save();

    categs[index] = categ;
}

async function createCategs() {
    console.log('Adding categs');
    await Promise.all([
        categCreate(0, 'Toys', 'toys for children'),
        categCreate(1, 'Groceries', 'household items'),
        categCreate(2, 'Car parts', 'parts for cars')
    ]);
}

async function createItems() {
    console.log('Adding items');
    await Promise.all([
        itemCreate(0, 'ball', 'bouncy', categs[0], '$5', 10),
        itemCreate(1, 'meat', 'delicious', categs[1], '$10', 15),
        itemCreate(2, 'tire', 'heavy', categs[2], '$50', 20),
    ]);
}
