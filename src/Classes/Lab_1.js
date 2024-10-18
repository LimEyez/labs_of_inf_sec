import {CustomError} from '@/Classes/CustomError.ts'

export class Lab_1 {
    constructor() {
        this.alphabet = " АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ,.-?!\";:)(".split('');
        this.key = [];

    }

    generateKey() {
        this.key = [...this.alphabet].sort(() => Math.random() - 0.5);
    }

    encrypt(message) {
        if (this.key == '') {
            throw new CustomError('Ошибка ключа', "Ключ отсутствует!")
        } else if (message.replace(' ', '') == '') {
            throw new CustomError(
                'Ошибка шифруемого сообщения', 
                "Шифруемое сообщение пустое или состоит только из пробелов!\nВедите другое сообщение.")
        } else if (/[^А-Яа-яЁё.,!?\";:( )\-\s]/.test(message)) {
            throw new CustomError('Ошибка шифруемого сообщения', "Шифруемое сообщение содержит посторонние символы!")
        }
        return message.toUpperCase().split('').map(char => {
            const index = this.alphabet.indexOf(char);
            return index !== -1 ? this.key[index] : char; // Заменяем по ключу, если символ найден
        }).join('');
    }

    decrypt(encryptedMessage) {
        if (encryptedMessage == "") {
            throw new CustomError('Ошибка зашифрованного сообщения', "Отсутствует зашифрованное сообщение")
        }
        return encryptedMessage.split('').map(char => {
            const index = this.key.indexOf(char);
            return index !== -1 ? this.alphabet[index] : char; // Возвращаем по исходному алфавиту
        }).join('');
    }

    getKey() {
        return this.key.join('');
    }

    // Метод для взлома (частотный анализ, упрощённый)
    crackMessage(startEncryptedMessage) {
        // Частотный порядок символов русского языка (чаще всего используемые буквы)
        const freqOrder = ' ОЕАНИТСЛВРКДМУПЯЬЫГБЧЗЖЙШХЮЭЦЩФЪЁ,.-?!\";:)('.split('');

        const encryptedMessage = startEncryptedMessage.toUpperCase();

        // Подсчёт частот каждого символа в зашифрованном сообщении
        const counts = {};
        encryptedMessage.split('').forEach(char => {
            if (counts[char]) {
                counts[char]++;
            } else {
                counts[char] = 1;
            }
        });

        // Сортируем символы по частоте встречаемости
        const sortedChars = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

        // Предполагаем ключ, связывая частые символы с частотным порядком русского языка
        const guessedKey = {};
        sortedChars.forEach((char, index) => {
            guessedKey[char] = freqOrder[index] || char;  // Подставляем частотные символы
        });

        // Восстанавливаем текст по частотному анализу
        return encryptedMessage.split('').map(char => guessedKey[char] || char).join('');
    }

}