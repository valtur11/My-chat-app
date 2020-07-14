const Message = { create: function (obj) { console.log(obj); } };
//seed sample data:
const testAr = [
  {text: 'lol1', createdAt:'2002-11-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol2', createdAt:'2002-01-09', recepient: '1t378904348', sender: '1t3789043487'},
  {text: 'lol3', createdAt:'2002-07-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol4', createdAt:'2002-08-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol5', createdAt:'2002-01-09', recepient: '1t3789043487', sender: '4t3789043487'},
  {text: 'lol6', createdAt:'2002-01-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol7', createdAt:'2002-12-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol8', createdAt:'2002-03-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol9', createdAt:'2002-12-09', recepient: '1t3789043487', sender: '1t3789043487'},
  {text: 'lol10', createdAt:'2002-12-09', recepient: '1t3789043487', sender: '1t3789043487'},
];
testAr.forEach(obj => Message.create(obj));