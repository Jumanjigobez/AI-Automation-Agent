

const getCurrentTime = () =>{
    return new Date().toLocaleTimeString();
}

const getCurrentDate = () =>{
    return new Date().toLocaleDateString();
}

const greetUser = (n) =>{
    return `Hello ${n}!`;
}

module.exports = {
    getCurrentTime,
    getCurrentDate,
    greetUser
}

