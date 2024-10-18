import {CustomError} from '@/Classes/CustomError.ts'

export class Lab_2 {
    constructor() {
        this.table = [];
        this.keyWord = '';
        this.fastSerchElement = {};
        this.encryptedMessage_table = [];
        this.encryptedMessage_string = '';
        this.decryptedMessage_string = '';
    }

    //Создание базовых матриц
    startConfig() {
        this.table = [];
        this.keyWord = '';
        this.fastSerchElement = {};
        this.encryptedMessage_table = [];
        this.encryptedMessage_string = '';
        this.decryptedMessage_string = '';
        this.completionTableOfKeys();
        this.completionTableOfSymbols();
    }

    //Заполение матрицы ADFGVX ключами A D F G V X 
    completionTableOfKeys() {
        ["", "A", "D", "F", "G", "V", "X"].forEach(element => {
            this.table.push([element])
        });
        ["A", "D", "F", "G", "V", "X"].forEach(element => {
            this.table[0].push(element)
        })
    }
    //Функция получения целого рандомного числа (включительно)
    getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }

    //Заполнение матрицы ADFGVX английским алфавитом и цифрами в рандомном порядке
    completionTableOfSymbols() {
        const charsArray = [
            'A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', ' ', '1', '2', '3',
            '4', '5', '6', '7', '8', '9'
        ];

        const objectOfFastSerch = {};

        //Получение рандомного индекса элемента из исходного алфавита и набора цифр charsArray
        const randomSymbolFromTable = () => {
            const randomSymbolIndex = this.getRandomIntInclusive(0, charsArray.length - 1);
            const returnedSymbol = charsArray[randomSymbolIndex];

            charsArray.splice(randomSymbolIndex, 1);
            return returnedSymbol;
        }

        for (let i = 1; i < this.table[0].length; i++) {
            for (let j = 1; j < this.table.length; j++) {
                const symbol = randomSymbolFromTable() + "";
                this.table[i].push(symbol);
                objectOfFastSerch[symbol] = this.table[i][0] + this.table[0][j]
            }
        }
        this.fastSerchElement = objectOfFastSerch;
    }

    //Сохранение ключевого слова
    setKeyWord(keyWord = '') {
            if (keyWord.replace(' ', '') == ''){
                throw new CustomError("Ошибка ключевого слова", "Ключевое слово пустое или состоит только из пробелов. Ведите другое ключевое слово!")
            }
            else{
                this.keyWord = keyWord.toUpperCase().replace("\n", '');
            }
    }

    //Шифрование сообщения в табличный вариант
    encrypt(message = '') {

        if (!/^[a-zA-Z.,!?;:'"()\[\]{}\- ]+$/.test(message)){
            throw new CustomError("Ошибка исходного сообщения" , "В исходном сообщении присутствуют недопустимые символы!")
        }

        // const keywordLikeArray = this.keyWord.replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '').replace("\n", '')
        //     .toUpperCase().split('').map(letter => {
        //         return [letter]
        //     });

        const keywordLikeArray = this.keyWord.replace("\n", '')
            .toUpperCase().split('').map(letter => {
                return [letter]
            });

        const encryptedMessageTable = [...keywordLikeArray];
        const messageLikeArray = message.replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '').toUpperCase().split('');

        const keyLength = keywordLikeArray.length;
        let count = 0;
        messageLikeArray.forEach(element => {

            if (count >= keyLength) {
                count = 0;
            };

            if (this.fastSerchElement[element]) {
                encryptedMessageTable[count].push(this.fastSerchElement[element])
            } else if (element === "\n") {

                encryptedMessageTable[count].push(this.fastSerchElement[" "])
            } else {
                encryptedMessageTable[count].push(element + element)
            }
            count++;
        });
        while (count < keyLength) {
            encryptedMessageTable[count].push(this.fastSerchElement[' ']);
            count++;
        }

        this.encryptedMessage_table = encryptedMessageTable.sort((a, b) => {
            if (a[0] < b[0]) return -1;  // Если первый элемент a меньше первого элемента b
            if (a[0] > b[0]) return 1;   // Если первый элемент a больше первого элемента b
            return 0;  // Если равны, ничего не меняем
        });

        this.convertEncryptedMessageToString();
    }

    //Перевод зашифрованного сообщения из табличного варианта в строку
    convertEncryptedMessageToString() {
        const temporaryTable = [];
        for (let i = 1; i < this.encryptedMessage_table[0].length; i++) {
            for (let j = 0; j < this.encryptedMessage_table.length; j++) {
                temporaryTable.push(this.encryptedMessage_table[j][i]);
            }
        }
        this.encryptedMessage_string = temporaryTable.join('');
        // console.log(this)
    }

    //Получение зашифрованного сообщения
    getEncryptedMessage() {
        return this.encryptedMessage_string;
    }

    decrypt(keyWord = this.keyWord.slice(), encryptMessage = this.encryptedMessage_string.slice()) {
        // const keyWordLikeArray = keyWord.slice().replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '')
        const keyWordLikeArray = keyWord.slice().replace("\n", '').toUpperCase().split('');
        const decryptedMessageTableWithSort = keyWordLikeArray.slice().sort().map(element => {
            return [element];
        });
        const keyLength = decryptedMessageTableWithSort.length;
        let index = 0;
        encryptMessage.toUpperCase().replace(/[^a-zA-Z0-9.,:;!?()'"-\s]/g, '').match(/.{1,2}/g).forEach(element => {
            if (index >= keyLength) {
                index = 0;
            }
            decryptedMessageTableWithSort[index].push(element)
            index++;
        });

        const getKeyByValue = (object, value) => {
                for (let key in object) {
                    if (object[key] === value) {
                        return key;
                    }
                }
                return (value[0])

        }

        const temporaryDecryptedMessageTableSortied = decryptedMessageTableWithSort.slice();
        const decryptedMessageTableSortiedByWord = [];

        let count = 0
        keyWordLikeArray.forEach(element => {
            temporaryDecryptedMessageTableSortied.forEach(array => {
                if (array[0] == element) {
                    count++
                    const index = temporaryDecryptedMessageTableSortied.indexOf(array);
                    decryptedMessageTableSortiedByWord.push(temporaryDecryptedMessageTableSortied[index].slice());
                    temporaryDecryptedMessageTableSortied.splice(index, 1);
                    return;
                }
            });

        });

        const resultTable = [];
        for (let i = 1; i < decryptedMessageTableSortiedByWord[0].length; i++) {
            for (let j = 0; j < decryptedMessageTableSortiedByWord.length; j++) {
                // console.log(getKeyByValue(this.fastSerchElement, decryptedMessageTableSortiedByWord[j][i], decryptedMessageTableSortiedByWord[j][i]))
                resultTable.push(getKeyByValue(this.fastSerchElement, decryptedMessageTableSortiedByWord[j][i]));
            }
        };
        this.decryptedMessage_string = resultTable.join('');
    }

    getDecryptedMessage() {
        return this.decryptedMessage_string;
    }

}

/* 
export class Lab_2 {
    constructor() {
        this.table = [];
        this.keyWord = '';
        this.fastSerchElement = {};
        this.encryptedMessage_table = [];
        this.encryptedMessage_string = '';
        this.decryptedMessage_string = '';
    }

    //Создание базовых матриц
    startConfig() {
        this.table = [];
        this.keyWord = '';
        this.fastSerchElement = {};
        this.encryptedMessage_table = [];
        this.encryptedMessage_string = '';
        this.decryptedMessage_string = '';
        this.completionTableOfKeys();
        this.completionTableOfSymbols();
    }

    //Заполение матрицы ADFGVX ключами A D F G V X 
    completionTableOfKeys() {
        ["", "A", "D", "F", "G", "V", "X"].forEach(element => {
            this.table.push([element])
        });
        ["A", "D", "F", "G", "V", "X"].forEach(element => {
            this.table[0].push(element)
        })
    }
    //Функция получения целого рандомного числа (включительно)
    getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }

    //Заполнение матрицы ADFGVX английским алфавитом и цифрами в рандомном порядке
    completionTableOfSymbols() {
        const charsArray = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I', 'J', 'K', 'L', 'M', 'N',
            'O', 'P', 'Q', 'R', 'S', 'T', 'U',
            'V', 'W', 'X', 'Y', 'Z', '0', '1',
            '2', '3', '4', '5', '6', '7', '8', '9'
        ];

        const objectOfFastSerch = {};

        //Получение рандомного индекса элемента из исходного алфавита и набора цифр charsArray
        const randomSymbolFromTable = () => {
            const randomSymbolIndex = this.getRandomIntInclusive(0, charsArray.length - 1);
            const returnedSymbol = charsArray[randomSymbolIndex];

            charsArray.splice(randomSymbolIndex, 1);
            return returnedSymbol;
        }

        for (let i = 1; i < this.table[0].length; i++) {
            for (let j = 1; j < this.table.length; j++) {
                const symbol = randomSymbolFromTable() + "";
                this.table[i].push(symbol);
                objectOfFastSerch[symbol] = this.table[i][0] + this.table[0][j]
            }
        }
        this.fastSerchElement = objectOfFastSerch;
        // console.log(this.fastSerchElement)
    }

    //Сохранение ключевого слова
    setKeyWord(keyWord = '') {
        this.keyWord = keyWord.toUpperCase();
    }

    //Шифрование сообщения в табличный вариант
    encrypt(message = '') {
        const keywordLikeArray = this.keyWord.replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase().split('').map(letter => {
                return [letter]
            });

        // const keywordLikeArray = [];

        const encryptedMessageTable = [...keywordLikeArray];
        const messageLikeArray = message.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().split('');
        const keyLength = keywordLikeArray.length;
        let count = 0;
        messageLikeArray.forEach(element => {
            if (count >= keyLength) {
                count = 0;
            }
            encryptedMessageTable[count].push(this.fastSerchElement[element])
            count++;
        });
        while (count < keyLength) {
            encryptedMessageTable[count].push(this.fastSerchElement['0']);
            count ++;
        }
        // console.log(encryptedMessageTable)
        // this.encryptedMessage_table = encryptedMessageTable
        this.encryptedMessage_table = encryptedMessageTable.sort((a, b) => {
            if (a[0] < b[0]) return -1;  // Если первый элемент a меньше первого элемента b
            if (a[0] > b[0]) return 1;   // Если первый элемент a больше первого элемента b
            return 0;  // Если равны, ничего не меняем
        });

        this.convertEncryptedMessageToString();
    }

    //Перевод зашифрованного сообщения из табличного варианта в строку
    convertEncryptedMessageToString() {
        const temporaryTable = [];
        for (let i = 1; i < this.encryptedMessage_table[0].length; i++){
            for (let j = 0; j < this.encryptedMessage_table.length; j++){
                temporaryTable.push(this.encryptedMessage_table[j][i]);
            }
        }
        this.encryptedMessage_string = temporaryTable.join('');
        // console.log(this)
    }

    //Получение зашифрованного сообщения
    getEncryptedMessage() {
        return this.encryptedMessage_string;
    }

    decrypt(keyWord = this.keyWord.slice(), encryptMessage = this.encryptedMessage_string.slice()) {
        const keyWordLikeArray = keyWord.slice().replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase().split('');
        const decryptedMessageTableWithSort = keyWordLikeArray.slice().sort().map(element => {
            return [element];
        });
        const keyLength = decryptedMessageTableWithSort.length;
        let index = 0;
        encryptMessage.toUpperCase().replace(/[^a-zA-Z0-9]/g, '').match(/.{1,2}/g).forEach(element => {
            if (index >= keyLength) {
                index = 0;
            }
            decryptedMessageTableWithSort[index].push(element)
            index++;
        });

        const getKeyByValue = (object, value) => {
            for (let key in object) {
                if (object[key] === value) {
                    return key;
                }
            }
            return null;  // Если значение не найдено
        }

        const temporaryDecryptedMessageTableSortied = decryptedMessageTableWithSort.slice();
        const decryptedMessageTableSortiedByWord = [];
        
        let count = 0
        keyWordLikeArray.forEach(element => {
            temporaryDecryptedMessageTableSortied.forEach(array => {
                if (array[0] == element) {
                    count++
                    const index = temporaryDecryptedMessageTableSortied.indexOf(array);
                    decryptedMessageTableSortiedByWord.push(temporaryDecryptedMessageTableSortied[index].slice());
                    temporaryDecryptedMessageTableSortied.splice(index, 1);
                    return;
                }
            });

        });

        const resultTable = [];
        for (let i = 1; i < decryptedMessageTableSortiedByWord[0].length; i++){
            for (let j = 0; j < decryptedMessageTableSortiedByWord.length; j++){
                // console.log(getKeyByValue(this.fastSerchElement, decryptedMessageTableSortiedByWord[j][i], decryptedMessageTableSortiedByWord[j][i]))
                resultTable.push(getKeyByValue(this.fastSerchElement, decryptedMessageTableSortiedByWord[j][i]));
            }
        };
        this.decryptedMessage_string = resultTable.join('');
    }

    getDecryptedMessage() {
        return this.decryptedMessage_string;
    }
    
}
*/