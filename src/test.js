
let sym =/[!@#$%^&*;]/

let at = /[abc]/
let str ='bcd'
let str2 ='bcd3'
let str3 ='bcd3'
let pass = /^\w+[!@#$%^&*;]/
// console.log(pass.test('sfrsf'))
// console.log(at.test('gdwfc'))
// console.log(letter.test(str))
// console.log(number.test(str2))
// console.log(sym.test(str3))

//test username
let letterUser = /([a-z]|[A-Z])/
let numberUser = /[0-9]/
let symbolUser = /[!@#$%^&*;]/
// console.log(letterUser.test('daf'))
// console.log(numberUser.test('s3rwf'))
// console.log(!symbolUser.test('srwf'))

//test password
let upperCase = /[a-z]/
let lowerCase = /[A-Z]/
let numberPass = /[0-9]/
let symbolPass = /[!@#$%^&*;]/
let symbolPass2 = /([a-z]|[A-Z]|[0-9])$/
// console.log(upperCase.test('Adafewo23'))
// console.log(symbolPass2.test('23srv2A'))

/*
syarat email:
- karakter pertama minimal terdapat 1 karakter huruf besar/kecil/angka => ^([a-z]|[0-9]|[A-Z])+
- karakter '.' dan '-' maksimal 1 karakter dan karakter setelahnya minimal terdapat 1 karakter huruf besar/kecil/angka => ([\.-]?([a-z]|[0-9]|[A-Z])+)* (notes:jumlah kejadian >= 0)
- Karakter '@' maksimal hanya ada satu karakter => @
- Setelah karakter '@' minimal harus ada 2 huruf kecil => ([a-z]){2,}
- Setelah karakter '.' minimal harus ada 2 huruf kecil => ([\.]?([a-z]){2,})* (notes:jumlah kejadian >= 0)
- Akhir dari karakter dengan '.' dan dilanjutkan dengan huruf kecil antara 2 atau 3 => (\.[a-z]{2,3})+$
*/

function ValidateEmail(mail) {
if (/^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/.test(mail)){
    console.log('Correct email')
  }else{
      console.log("Incorrect email")
  }
}

ValidateEmail('9.ammadkpnddgm@ddwd')


let users = [
  {
    "id": 1,
    "username": "admin",
    "password": "admin",
    "role": "admin",
    "email": "admin@shoes.com"
  },
  {
    "id": 2,
    "username": "user",
    "password": "user",
    "role": "user",
    "email": "user@gmail.com"
  },
  {
    "username": "Muhammadkpn1308",
    "password": "Mkpn34#12",
    "role": "user",
    "email": "Muhammadkpn@gmail.com",
    "id": 3
  },
  {
    "username": "mkpn1104",
    "password": "Mkpn31%3",
    "role": "user",
    "email": "mkpn1304@gmail.com",
    "id": 4
  },
  {
    "role": "user",
    "username": "Mks*h22",
    "email": "mksrfh@gafs.cpd.com",
    "password": "Dd3!@$%^*;3",
    "id": 5
  }
]

console.log(users.filter(item => item.username == 'admin'))
