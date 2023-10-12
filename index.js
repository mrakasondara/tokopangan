const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const multer = require("multer");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { generateId, generateImage } = require("./utils/generate");
const methodOverride = require("method-override");

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

// override
app.use(methodOverride("_method"));

// notif
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
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
    msg: req.flash("msg"),
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
  req.flash("msg", "Data Produk Berhasil Ditambahkan !");
  res.redirect("/dashboard/produk");
});
app.get("/dashboard/penjualan", (req, res) => {
  res.render("dashboard/penjualan", {
    layout: "layouts/layout",
    title: "Data Penjualan | Dashboard Admin",
    nama: "Muhammad Raka",
  });
});
app.get("/dashboard/produk/detail/:id", (req, res) => {
  console.log(req.params.id);
  res.redirect("/dashboard/produk");
});
app.get("/dashboard/produk/ubah/:id", (req, res) => {
  console.log(req.params.id);
  res.redirect("/dashboard/produk");
});
app.get("/dashboard/produk/hapus/:id", (req, res) => {
  Product.deleteOne({ id: req.params.id }).then((result) => {
    req.flash("msg", "Data Produk Berhasil Ditambahkan !");
    res.redirect("/dashboard/produk");
  });
});
app.get("/dashboard/user", async (req, res) => {
  const users = await User.find();
  const id = generateId(5);
  res.render("dashboard/user", {
    layout: "layouts/layout",
    title: "Data User | Dashboard Admin",
    nama: "Muhammad Raka",
    users,
    id,
    msg: req.flash("msg"),
  });
});

app.post("/dashboard/user", multerUploadUser.single("image"), (req, res) => {
  const img = req.file ? req.file.originalname : generateImage(req.body.jk);
  User.insertMany({
    id: req.body.id,
    nama: req.body.nama,
    jk: req.body.jk,
    alamat: req.body.alamat,
    nohp: req.body.nohp,
    image: img,
  });
  req.flash("msg", "Data User Berhasil Ditambahkan !");
  res.redirect("/dashboard/user");
});
app.get("/dashboard/user/hapus/:id", (req, res) => {
  User.deleteOne({ id: req.params.id }).then((result) => {
    req.flash("msg", "Data Produk Berhasil Dihapus !");
    res.redirect("/dashboard/user");
  });
});

// app.use("/", (req, res) => {
//   res.status(404);
//   res.send("<h4>404</h4>");
// });

app.listen(port, () => {
  console.log(`Grocery Store Listening At localhost:${port}`);
});
