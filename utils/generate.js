const fs = require("fs");

const generateId = (n) => {
  let data = "";
  const angka = "0123456789";
  for (let i = 0; i < n; i++) {
    data += angka.charAt(Math.floor(Math.random() * 10));
  }
  return data;
};

const generateImage = (jk) => {
  const imageP = ["1.png", "3.png", "5.png"];
  const imageL = ["2.png", "4.png", "6.png"];
  if (jk == "Laki-Laki") {
    return imageL[Math.floor(Math.random() * 3)];
  } else {
    return imageP[Math.floor(Math.random() * 3)];
  }
};

const deleteImage = (img) => {
  const directory = process.cwd();
  switch (img) {
    case "1.png":
      break;
    case "2.png":
      break;
    case "3.png":
      break;
    case "4.png":
      break;
    case "5.png":
      break;
    case "6.png":
      break;
    default:
      fs.unlinkSync(`${directory}/public/user_img/${img}`);
  }
};

module.exports = { generateId, generateImage, deleteImage };
