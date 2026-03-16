let a = 10;
let b = 5; 

console.log("Сума:", a + b);
console.log("Різниця:", a - b);
console.log("Множення:", a * b);
console.log("Ділення:", a / b);


let firstName = "Каламаж";
let lastName = "Володимир";

let fullName = firstName + " " + lastName;

console.log("Добрий день, " + fullName + "!");


let age = 20;

if (age >= 18) {
    console.log("Доступ дозволено");
} else {
    console.log("Доступ заборонено");
}

for (let i = 1; i <=10; i++) { 
    console.log(i);
}

function square(number) {
    return number * number;
}

let result = square(5);

console.log("Кдварат числа: ", result);
 
let fruits = ["яблуко", "груша", "банана"];

fruits.push ("авокадо")

console.log(fruits);