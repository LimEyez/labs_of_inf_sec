function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function generateRandomPrime(range = 100) {
    let prime = 0;
    while (!isPrime(prime)) {
        prime = Math.floor(Math.random() * range) + 2;
    }
    return prime;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function findE(f) {
    let e = 3; // Начнем с 3
    while (e < f) {
        if (gcd(e, f) === 1) {
            return e;
        }
        e += 2;
    }
    return null; // Возвращаем null, если не нашли
}

function findModularInverse(e, f) {
    let d = 1;
    while ((d * e) % f !== 1) {
        d++;
    }
    return d;
}

function generateKeys() {
    // Шаг 1: Генерация P и Q
    let p = generateRandomPrime(100);
    let q = generateRandomPrime(100);
    while (p === q) {
        q = generateRandomPrime(100);
    }

    // Шаг 2: n = P * Q
    const n = p * q;

    // Шаг 3: f(n) = (p-1)(q-1)
    const f = (p - 1) * (q - 1);

    // Шаг 4: Выбор e и вычисление d
    const e = findE(f);
    const d = findModularInverse(e, f);

    return {
        openKey: { e, n }, // Открытый ключ
        privateKey: { p, q, d } // Закрытый ключ
    };
}

// Преобразуем строку в массив чисел (Unicode)
function stringToNumbers(str) {
    return Array.from(str).map(char => char.charCodeAt(0));
}

// Преобразуем массив чисел обратно в строку
function numbersToString(nums) {
    return nums.map(num => String.fromCharCode(num)).join('');
}

function encryptMessage(message, openKey) {
    const { e, n } = openKey;
    return message.map(num => modPow(num, e, n));
}

function decryptMessage(encryptedMessage, privateKey) {
    const { p, q, d } = privateKey;
    const n = p * q;
    return encryptedMessage.map(encrypted => modPow(encrypted, d, n));
}

function signMessage(message, privateKey) {
    const { p, q, d } = privateKey;
    const n = p * q;
    return message.map(num => modPow(num, d, n));
}

function verifySignature(signature, openKey) {
    const { e, n } = openKey;
    return signature.map(sig => modPow(sig, e, n));
}

try {
    // Генерация ключей
    const { openKey, privateKey } = generateKeys();
    console.log("Открытый ключ:", openKey);
    console.log("Закрытый ключ:", privateKey);

    // Сообщение для теста (строка, включая русские символы)
    const message = "Привет, RSA!"; // Сообщение в виде строки с русскими символами
    console.log("Исходное сообщение:", message);

    // Преобразование сообщения в массив чисел (Unicode)
    const messageNumbers = stringToNumbers(message);
    console.log("Сообщение в числовом виде:", messageNumbers);

    // Шаг: Шифрование сообщения открытым ключом
    const encryptedMessage = encryptMessage(messageNumbers, openKey);
    console.log("Зашифрованное сообщение:", encryptedMessage);

    // Шаг: Расшифровка сообщения закрытым ключом
    const decryptedMessageNumbers = decryptMessage(encryptedMessage, privateKey);
    console.log("Расшифрованное сообщение (числа):", decryptedMessageNumbers);

    // Преобразование расшифрованного сообщения обратно в строку
    const decryptedMessage = numbersToString(decryptedMessageNumbers);
    console.log("Расшифрованное сообщение (строка):", decryptedMessage);

    // Шаг: Подписание сообщения
    const signature = signMessage(messageNumbers, privateKey);
    console.log("Подпись сообщения (S):", signature);

    // Шаг: Проверка подписи
    const verifiedMessageNumbers = verifySignature(signature, openKey);
    console.log("Верифицированное сообщение (M'):", verifiedMessageNumbers);

    // Проверка равенства исходного и восстановленного сообщения
    const verifiedMessage = numbersToString(verifiedMessageNumbers);
    console.log("Сообщение совпадает после верификации:", message === verifiedMessage);
} catch (error) {
    console.error("Произошла ошибка:", error.message);
}
