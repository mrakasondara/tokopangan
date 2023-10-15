const fs = require("fs");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const multer = require("multer");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { generateId, generateImage, deleteImage } = require("./utils/generate");
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
app.get("/dashboard/produk/detail/:id", async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  res.render("dashboard/detailproduk", {
    layout: "layouts/layout",
    title: "Detail Produk | Dashboard Admin",
    nama: "Muhammad Raka",
    product,
  });
});
app.delete("/dashboard/produk", async (req, res) => {
  const product = await Product.findOne({ id: req.body.id });
  const oldImage = product.image;
  fs.unlinkSync(`${__dirname}/public/img/${oldImage}`);
  Product.deleteOne({ id: req.body.id }).then((result) => {
    req.flash("msg", "Data Produk Berhasil Dihapus !");
    res.redirect("/dashboard/produk");
  });
});

app.get("/dashboard/produk/ubah/:id", async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  res.render("dashboard/ubahproduk", {
    layout: "layouts/layout",
    title: "Ubah Produk | Dashboard Admin",
    nama: "Muhammad Raka",
    product,
  });
});

app.put(
  "/dashboard/ubahproduk",
  multerUpload.single("image"),
  async (req, res) => {
    const product = await Product.findOne({ id: req.body.id });
    const oldImage = product.image;
    if (!req.file) {
      Product.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            harga: req.body.harga,
            stok: req.body.stok,
            jenis: req.body.jenis,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data Produk Berhasil Diubah!");
        res.redirect("/dashboard/produk");
      });
    } else {
      fs.unlinkSync(`${__dirname}/public/img/${oldImage}`);
      Product.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            harga: req.body.harga,
            stok: req.body.stok,
            jenis: req.body.jenis,
            image: req.file.originalname,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data Produk Berhasil Diubah!");
        res.redirect("/dashboard/produk");
      });
    }
  }
);

app.get("/dashboard/penjualan", (req, res) => {
  res.render("dashboard/penjualan", {
    layout: "layouts/layout",
    title: "Data Penjualan | Dashboard Admin",
    nama: "Muhammad Raka",
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
    errormsg: req.flash("err"),
  });
});

app.post("/dashboard/user", multerUploadUser.single("image"), (req, res) => {
  const img = req.file ? req.file.originalname : generateImage(req.body.jk);
  User.insertMany({
    id: req.body.id,
    nama: req.body.nama,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    jk: req.body.jk,
    alamat: req.body.alamat,
    nohp: req.body.nohp,
    image: img,
  });
  req.flash("msg", "Data User Berhasil Ditambahkan !");
  res.redirect("/dashboard/user");
});
app.delete("/dashboard/user", async (req, res) => {
  const user = await User.findOne({ id: req.body.id });
  const oldImage = user.image;
  deleteImage(oldImage);
  User.deleteOne({ id: req.body.id }).then((result) => {
    req.flash("msg", "Data User Berhasil Dihapus !");
    res.redirect("/dashboard/user");
  });
});

app.get("/dashboard/user/ubah/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  res.render("dashboard/ubahuser", {
    layout: "layouts/layout",
    title: "Ubah User | Dashboard Admin",
    nama: "Muhammad Raka",
    user,
    msg: req.flash("msg"),	
  });
});

app.put(
  "/dashboard/user",
  multerUploadUser.single("image"),
  async (req, res) => {
    const user = await User.findOne({ id: req.body.id });
    const oldImage = user.image;
    if (!req.file) {
      User.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            username: req.body.username,
            email: req.body.email,
            alamat: req.body.alamat,
            nohp: req.body.nohp,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data User Berhasil Di Ubah!");
        res.redirect("/dashboard/user");
      });
    } else {
      deleteImage(oldImage);
      User.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            username: req.body.username,
            email: req.body.email,
            alamat: req.body.alamat,
            nohp: req.body.nohp,
            image: req.file.origialname,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data User Berhasil Di Ubah");
        res.redirect("/dashboard/user");
      });
    }
  }
);
app.get("/dashboard/user/ubahpassword/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  res.render("dashboard/ubahpassword", {
    layout: "layouts/layout",
    title: "Ubah Password | Dashboard Admin",
    nama: "Muhammad Raka",
    user,
    errormsg: req.flash("errormsg"),
  });
});
app.put("/dashboard/user/ubahpassword", async (req, res) => {
  const user = await User.findOne({ id: req.body.id });
  const oldPassword = user.password;
  const authPassword = req.body.password;
  const newPassword1 = req.body.newpassword1;
  const newPassword2 = req.body.newpassword2;

  if (authPassword != oldPassword) {
    req.flash("errormsg","password lama salah");
res.redirect(`/dashboard/user/ubahpassword/${user.id}`);	
  }
  else {
    if (newPassword1 != newPassword2) {
      req.flash("errormsg","password 1 dan 2 tidak sama");
res.redirect(`/dashboard/user/ubahpassword/${user.id}`);	
   } else {
     req.flash("msg","sukses");
    res.redirect(`/dashboard/user/ubah/${user.id}`);	 
}
  }

});
app.get("/dashboard/user/detail/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  res.render("dashboard/detailuser", {
    layout: "layouts/layout",
    title: "Detail User | Dashboard Admin",
    nama: "Muhammad Raka",
    user,
  });
});

// app.use("/", (req, res) => {
//   res.status(404);
//   res.send("<h4>404</h4>");
// });

app.listen(port, () => {
  console.log(`Grocery Store Listening At localhost:${port}`);
});
