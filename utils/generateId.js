const generateId = () => {
  let data = "";
  const angka = "0123456789";
  for (let i = 0; i < 10; i++) {
    data += angka.charAt(Math.floor(Math.random() * 10));
  }
  return data;
};

module.exports = generateId;
