const express = require("express");
const fileUpload = require("express-fileupload");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;
const generateId = require("./utils/generateId");

app.use(fileUpload());

// ejs
app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// mongoose
const { Product } = require("./model/product");
require("./utils/db");

app.get("/dashboard", async (req, res) => {
  const products = await Product.find();
  const productLength = await Product.countDocuments({}).exec();
  res.render("dashboard/index", {
    layout: "layouts/layout",
    title: "Dashboard Admin",
    nama: "Muhammad Raka",
    products,
    productLength,
  });
});
app.get("/dashboard/produk", async (req, res) => {
  const products = await Product.find();
  const id = generateId();
  res.render("dashboard/produk", {
    layout: "layouts/layout",
    title: "Data Produk | Dashboard Admin",
    nama: "Muhammad Raka",
    products,
    id,
  });
});
app.post("/dashboard/produk", (req, res) => {
  console.log(req.files.file);
  // if (req.files) {
  //   const file = req.files.file;
  //   const fileName = file.filename;
  //   file.mv("/img", fileName, (err) => {
  //     if (err) {
  //       res.send("eror");
  //     } else {
  //       res.redirect("/dashboard/produk");
  //     }
  // });
  // }
  // Product.insertMany(req.body);
  res.redirect("/dashboard/produk");
});
app.get("/dashboard/penjualan", (req, res) => {
  res.render("dashboard/penjualan", {
    layout: "layouts/layout",
    title: "Data Penjualan| Dashboard Admin",
    nama: "Muhammad Raka",
  });
});
app.get("/dashboard/user", (req, res) => {
  res.render("dashboard/user", {
    layout: "layouts/layout",
    title: "Data User| Dashboard Admin",
    nama: "Muhammad Raka",
  });
});

// app.use("/", (req, res) => {
//   res.status(404);
//   res.send("<h4>404</h4>");
// });

app.listen(port, () => {
  console.log(`Grocery Store Listening At localhost:${port}`);
});
