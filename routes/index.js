var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Category = require("../models/category");

router.get('/', asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "name description category price number_in_stock")
    .populate("category").exec();
    const allCategs = await Category.find({}, "name description").exec();

    res.render("index", { title: "All Items", items: allItems, categs: allCategs });
}));

router.post('/', asyncHandler(async (req, res, next) => {
    
    const categ = await Category.find({name: req.body.cat}, "_id").exec();
    const allItems = await Item.find({category: categ}, "name description category price number_in_stock")
    .populate("category").exec();
    const allCategs = await Category.find({}, "name description").exec();

    res.render("index", { title: 'All ' + req.body.cat, items: allItems, categs: allCategs });
}));

router.get('/categories', asyncHandler(async (req, res, next) => {
    const allCategs = await Category.find({}, "name description")
    .exec();

    res.render("categs", { title: "All Categories", categs: allCategs });
}));

router.get('/categories/add', asyncHandler(async (req, res, next) => {
    const allCategs = await Category.find({}).exec();

    res.render("categ-add", { title: "Add Category", categs: allCategs });
}));

router.post('/categories/add', asyncHandler(async (req, res, next) => {
    const categ = new Category({name: req.body.name, description: req.body.desc});
    await categ.save();

    res.redirect(categ.url);
}));


router.get('/items/add', asyncHandler(async (req, res, next) => {
    const allCategs = await Category.find({}).exec();

    res.render("item-add", { title: 'Add Item', categs: allCategs });
}));

router.post('/items/add', asyncHandler(async (req, res, next) => {
    const categ = await Category.find({name: req.body.categ},).exec();
    const item = new Item({ name: req.body.name, description: req.body.desc, category: categ[0], price: req.body.price, number_in_stock: req.body.num });
    await item.save();

    res.redirect(item.url);
}));

router.get('/items/:id', asyncHandler(async (req, res, next) => {
    const item = await Item.find({_id: req.params.id}).populate("category").exec();
    const allCategs = await Category.find({}).exec();

    res.render("item-page", { title: item[0].name, items: item, categs: allCategs });
}));

router.get('/items/:id/delete', asyncHandler(async (req, res, next) => {
    const item = await Item.find({_id: req.params.id}).populate("category").exec();
    const allCategs = await Category.find({}).exec();

    res.render("item-del", { title: 'Delete Item', items: item, categs: allCategs });
}));

router.post('/items/:id/delete', asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.body.id);
    res.redirect('/');
}));

router.get('/items/:id/edit', asyncHandler(async (req, res, next) => {
    const item = await Item.find({_id: req.params.id}).populate("category").exec();
    const allCategs = await Category.find({}).exec();

    res.render("item-edit", { title: 'Edit Item', items: item, categs: allCategs });
}));

router.post('/items/:id/edit', asyncHandler(async (req, res, next) => {
    const categ = await Category.find({name: req.body.categ}).exec();
    const item = new Item({ _id: req.body.id, name: req.body.name, description: req.body.desc, category: categ[0], price: req.body.price, number_in_stock: req.body.num });
    const newItem = await Item.findByIdAndUpdate(req.body.id, item, {});
    res.redirect(newItem.url);
}));

router.get('/categories/:id', asyncHandler(async (req, res, next) => {
    const categ = await Category.find({_id: req.params.id}).exec();
    const allCategs = await Category.find({}).exec();

    res.render("categ-page", { title: categ[0].name, categ, categs: allCategs });
}));

router.get('/categories/:id/delete', asyncHandler(async (req, res, next) => {
    const categ = await Category.find({_id: req.params.id}).exec();
    const allCategs = await Category.find({}).exec();

    res.render("categ-del", { title: 'Delete Category', items: categ, categs: allCategs });
}));

router.post('/categories/:id/delete', asyncHandler(async (req, res, next) => {
    await Category.findByIdAndDelete(req.body.id);
    res.redirect('/categories');
}));

router.get('/categories/:id/edit', asyncHandler(async (req, res, next) => {
    const categ = await Category.find({_id: req.params.id}).exec();
    const allCategs = await Category.find({}).exec();

    res.render("categ-edit", { title: 'Edit Category', items: categ, categs: allCategs });
}));

router.post('/categories/:id/edit', asyncHandler(async (req, res, next) => {
    const categ = new Category({ _id: req.body.id, name: req.body.name, description: req.body.desc });
    const newCateg = await Category.findByIdAndUpdate(req.body.id, categ, {});
    res.redirect(newCateg.url);
}));

module.exports = router;
