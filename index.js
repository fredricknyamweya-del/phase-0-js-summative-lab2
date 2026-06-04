function increment() {
    let a = 0;
    function add (){
        a++
        return a
    }

    return add
}

const add = increment()

console.log(add())
console.log(add())
console.log(add())