function Calculate(str) {
    str = document.querySelector('.i-1').value;
    //Basic string length check
    if (str.length >= 512) {
        return console.log('You entered a value whose length is greater than 512');
    }
    //Regular expression
    const regex = /^[-+](?:[0-9]*[.])?[0-9]+|(?<=\(|\/|\*)[+-](?:[0-9]*[.])?[0-9]+|(?:[0-9]*[.])?[0-9]+|[-+*\/()]/g;
    const expression = [];
    let expression_index = [];

    // Split our expression into an array of
    // subarrays into which we write our expressions in parentheses
    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match) => {
            let current_expression;
            switch (match) {
                case '(':
                    current_expression = expression;
                    for (let index of expression_index) {
                        current_expression = current_expression[index];
                    }
                    expression_index.push(current_expression.push([]) - 1);
                    break;
                case ')':
                    expression_index.pop();  //Delete last index array
                    break;
                default:
                    current_expression = expression;
                    for (let index of expression_index) {
                        current_expression = current_expression[index];
                    }
                    if (isNaN(parseFloat(match))) {
                        current_expression.push(match);
                    }
                    else {
                        current_expression.push(parseFloat(match));
                    }
            }
        });
    }
    //Object of mathematical operations
    const calculatorOperations = {
        '*': function (arg1, arg2) { return arg1 * arg2 },
        '/': function (arg1, arg2) { return arg1 / arg2 },
        '+': function (arg1, arg2) { return arg1 + arg2 },
        '-': function (arg1, arg2) { return arg1 - arg2 },
    };

    //The operationOnEntry function takes an object of operands and conditionally checks through a
    // loop if the operand is in the array, if so, it returns the index of the operand.
    function operateOnEntry(userEntry) {
        let indexOfOperand;
        Object.keys(calculatorOperations).forEach(function(functionName) {
            while (userEntry.includes(functionName)) {
                indexOfOperand = userEntry.indexOf(functionName);
                userEntry = calculationSequence(functionName, indexOfOperand, userEntry);
            }
        });
        return userEntry;
    }
    // returnArg function gets index, userEntry
    // and assigns arg1 and arg2 taking by index
    function returnArg(index, userEntry) {
        const arg1 = Number(userEntry[index - 1]);
        const arg2 = Number(userEntry[index + 1]);
        return [arg1, arg2];

    }
    //ReturnSpliced function replaces arguments with
    // the result of mathematical operations
    function returnSpliced(index, newTotal, userEntry) {
        userEntry.splice((index - 1), 3, newTotal);
        return userEntry;
    }
    //The calculationSequence function returns the result
    // of a mathematical operation between the arguments.
    function calculationSequence(operation, indexOfOperand, userEntry) {
        const getArgs = returnArg(indexOfOperand, userEntry);
        const newTotalForEntry = calculatorOperations[operation](getArgs[0], getArgs[1]);
        return returnSpliced(indexOfOperand, newTotalForEntry, userEntry);
    }
    //Recursion
    function calculate(entry) {
        for (let index in entry) {
            if (Array.isArray(entry[index])) {
                entry[index] = calculate(entry[index]);
            }
        }
        return operateOnEntry(entry)[0];
    }
    document.querySelector('output').innerHTML = calculate(expression);
}
    document.querySelector('.b-1').addEventListener('click', Calculate)