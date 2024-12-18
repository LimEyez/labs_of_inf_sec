// Генерация случайного простого числа
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function generateRandomPrime(range) {
    let prime = 0;
    while (!isPrime(prime)) {
        prime = Math.floor(Math.random() * range) + 2;
    }
    return prime;
}

// Расширенный алгоритм Евклида для поиска обратного числа (modular inverse)
function gcdExtended(a, b) {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    let { gcd, x: x1, y: y1 } = gcdExtended(b, a % b);
    return { gcd, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

function modularInverse(e, phi) {
    const { gcd, x } = gcdExtended(e, phi);
    if (gcd !== 1) throw new Error('Modular inverse does not exist');
    return ((x % phi) + phi) % phi;
}

// Генерация ключей RSA
function generateRSAKeys() {
    const p = generateRandomPrime(100); // Простое число p
    const q = generateRandomPrime(100); // Простое число q
    const n = p * q; // Модуль n
    const phi = (p - 1) * (q - 1); // Функция Эйлера

    // Выбираем e (открытая экспонента), которая взаимно проста с phi
    let e = 3;
    while (gcdExtended(e, phi).gcd !== 1) {
        e++;
    }

    // Находим d (закрытая экспонента)
    const d = modularInverse(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n },
    };
}

// Функция для возведения в степень по модулю (быстрое возведение)
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

// Шифрование сообщения
function encrypt(message, publicKey) {
    const { e, n } = publicKey;
    return message.split('').map(char => {
        const m = char.charCodeAt(0);
        return modPow(m, e, n);
    });
}

// Дешифрование сообщения
function decrypt(encryptedMessage, privateKey) {
    const { d, n } = privateKey;
    return encryptedMessage.map(c => {
        const m = modPow(c, d, n);
        return String.fromCharCode(m);
    }).join('');
}

// Тестирование RSA
const { publicKey, privateKey } = generateRSAKeys();
console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);

const message = 'HELLO';
console.log('Original Message:', message);

const encryptedMessage = encrypt(message, publicKey);
console.log('Encrypted Message:', encryptedMessage);

const decryptedMessage = decrypt(encryptedMessage, privateKey);
console.log('Decrypted Message:', decryptedMessage);
