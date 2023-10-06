const mongoose = require("mongoose");
const uri =
  "mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/grosir?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const newProduct = new Product({
//   id: '0912131471',
//   nama: "Wagyu A5",
//   harga: "125.000",
//   stok: "25 Pcs",
//   image: "Wagyu A5.jpg",
// });

// newProduct.save().then((product) => console.log(product));
