const express = require("express");
// const fileUpload = require("express-fileupload");
const multer = require("multer");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { generateId, generateImage } = require("./utils/generate");

// app.use(fileUpload());
// multer
const multerDiskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const multerDiskStorageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/user_img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// ejs
app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// mongoose
const { Product, User } = require("./model/model");
require("./utils/db");

const multerUpload = multer({ storage: multerDiskStorage });
const multerUploadUser = multer({ storage: multerDiskStorageUser });

app.get("/dashboard", async (req, res) => {
  const products = await Product.find();
  const productLength = await Product.countDocuments({}).exec();
  const userLength = await User.countDocuments({}).exec();
  res.render("dashboard/index", {
    layout: "layouts/layout",
    title: "Dashboard Admin",
    nama: "Muhammad Raka",
    products,
    productLength,
    userLength,
  });
});
app.get("/dashboard/produk", async (req, res) => {
  const products = await Product.find();
  const id = generateId(10);
  res.render("dashboard/produk", {
    layout: "layouts/layout",
    title: "Data Produk | Dashboard Admin",
    nama: "Muhammad Raka",
    products,
    id,
  });
});
app.post("/dashboard/produk", multerUpload.single("image"), (req, res) => {
  Product.insertMany({
    id: req.body.id,
    nama: req.body.nama,
    harga: req.body.harga,
    stok: req.body.stok,
    image: req.file.originalname,
    jenis: req.body.jenis,
  });
  res.redirect("/dashboard/produk");
});
app.get("/dashboard/penjualan", (req, res) => {
  res.render("dashboard/penjualan", {
    layout: "layouts/layout",
    title: "Data Penjualan| Dashboard Admin",
    nama: "Muhammad Raka",
  });
});

app.get("/dashboard/user", async (req, res) => {
  const users = await User.find();
  const id = generateId(5);
  res.render("dashboard/user", {
    layout: "layouts/layout",
    title: "Data User| Dashboard Admin",
    nama: "Muhammad Raka",
    users,
    id,
  });
});

app.post("/dashboard/user", (req, res) => {
  console.log(req.body.nama);
  res.redirect("/dashboard/user");
});

// app.use("/", (req, res) => {
//   res.status(404);
//   res.send("<h4>404</h4>");
// });

app.listen(port, () => {
  console.log(`Grocery Store Listening At localhost:${port}`);
});
