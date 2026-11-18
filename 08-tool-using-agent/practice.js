

const input = process.argv[2];


const greetings = (n) =>{
    const time =  new Date().toLocaleTimeString();
    const name = !n ? "Friend" : n;
    return `Hello ${name}! The current time is ${time}`;
};

const greet = greetings(input);

console.log(greet);

