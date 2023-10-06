const mongoose = require("mongoose");
const Product = mongoose.model("Product", {
  id: {
    type: String,
    require: true,
  },
  nama: {
    type: String,
    require: true,
  },
  harga: {
    type: String,
    require: true,
  },
  stok: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  jenis: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", {
  id:{
    type: String,
    require: true,
  },
  nama:{
    type: String,
    require: true,
  },
  jk:{
    type: String,
    require: true,
  },
  alamat:{
    type: String,
    require: true,
  },
  nohp:{
    type: String,
    require: true,
  },
  image:{
    type: String,
    require: true,
  },
})

module.exports = { Product,User };
