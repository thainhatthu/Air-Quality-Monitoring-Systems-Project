const formatDate = (date) => {
  let month = date.getMonth()+1;
  let day = date.getDate();
  let year = date.getFullYear();
  // let hour = date.getHours();
  // let minute = date.getMinutes();
  // let second = date.getSeconds();
  // return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  return `${day}-${month}-${year}`;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
const newDate = new Date();
console.log(formatDate(newDate));
module.exports = {
 formatDate: formatDate,
 getRndInteger: getRndInteger
}