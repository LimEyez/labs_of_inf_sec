// import { CustomError } from '@/Classes/CustomError.ts'

// export class Lab_5 {
//     constructor() {
//         this.openKey = { e: null, n: null };
//         this.privateKey = { p: null, q: null, d: null };
//     }


//     isPrime(num) {
//         if (num < 2) return false;
//         for (let i = 2; i <= Math.sqrt(num); i++) {
//             if (num % i === 0) return false;
//         }
//         return true;
//     }

//     generateRandomPrime(range = 100) {
//         let prime = 0;
//         while (!this.isPrime(prime)) {
//             prime = Math.floor(Math.random() * range) + 2;
//         }
//         return prime;
//     }

//     gcd(a, b) {
//         return b === 0 ? a : this.gcd(b, a % b);
//     }

//     findE(f) {
//         let e = 3;
//         while (e < f) {
//             if (this.gcd(e, f) === 1) {
//                 return e;
//             }
//             e += 2;
//         }
//         return null;
//     }

//     findModularInverse(e, f) {
//         let d = 1;
//         while ((d * e) % f !== 1) {
//             d++;
//         }
//         return d;
//     }

//     generateKeys() {
//         let p = this.generateRandomPrime(100);
//         let q = this.generateRandomPrime(100);
//         while (p === q) {
//             q = this.generateRandomPrime(100);
//         }

//         const n = p * q;

//         const f = (p - 1) * (q - 1);

//         const e = this.findE(f);
//         const d = this.findModularInverse(e, f);

//         this.openKey = { e, n },
//             this.privateKey = { p, q, d }

//     }

//     stringToNumbers(str) {
//         return Array.from(str).map(char => char.charCodeAt(0));
//     }

//     numbersToString(nums) {
//         return nums.map(num => String.fromCharCode(num)).join('');
//     }

//     encryptMessage(message, openKey = this.openKey) {
//         const { e, n } = openKey;

//         return message.map(num => this.modPow(num, e, n));
//     }

//     decryptMessage(encryptedMessage, privateKey = this.privateKey) {
//         const { p, q, d } = privateKey;
//         const n = p * q;
//         return encryptedMessage.map(encrypted => this.modPow(encrypted, d, n));
//     }

//     // signMessage(message, privateKey = this.privateKey) {
//     //     const { p, q, d } = privateKey;
//     //     const n = p * q;
//     //     return message.map(num => this.modPow(num, d, n));
//     // }

//     // verifySignature(signature, openKey = this.openKey) {
//     //     const { e, n } = openKey;
//     //     return signature.map(sig => this.modPow(sig, e, n));
//     // }

//     // signMessage(message, privateKey = this.privateKey) {
//     //     console.log(message)
//     //     const { p, q, d } = privateKey;
//     //     const n = p * q;
//     //     const messageHash = this.hashMessage(message); 
//     //     return this.modPow(messageHash, d, n); 
//     // }

//     // verifySignature(message, signature, openKey = this.openKey) {
//     //     console.log(message)
//     //     const { e, n } = openKey;
//     //     const restoredHash = this.modPow(signature, e, n);
//     //     const messageHash = this.hashMessage(message);
//     //     console.log(this.hashMessage(message))
//     //     console.log(restoredHash, messageHash)
//     //     return restoredHash === messageHash;
//     // }

//     modPow(base, exp, mod) {
//         let result = 1;
//         base = base % mod;
//         while (exp > 0) {
//             if (exp % 2 === 1) {
//                 result = (result * base) % mod;
//             }
//             exp = Math.floor(exp / 2);
//             base = (base * base) % mod;
//             console.log(result, base)
//         }
//         return result;
//     }




//     signMessage(message, privateKey = this.privateKey) {
//         const { p, q, d } = privateKey;
//         const n = p * q;
//         const messageHash = this.hashMessage(message); // Числовой хэш сообщения
//         console.log(messageHash)
//         return this.modPow(messageHash, d, n); // Возвращаем подписанный хэш
//     }

//     verifySignature(message, signature, openKey = this.openKey) {
//         signature -=0;
//         const { e, n } = openKey;
//         console.log(e, n, signature)
//         const restoredHash = this.modPow(signature, e, n); // Восстанавливаем хэш из подписи
//         const messageHash = this.hashMessage(message); // Считаем хэш сообщения
//         console.log("Restored:", restoredHash, "Calculated:", messageHash);
//         return restoredHash === messageHash; // Сравниваем
//     }

//     hashMessage(message) {
//         let hash = 0;
//         for (let i = 0; i < message.length; i++) {
//             const charCode = message.charCodeAt(i);
//             hash = (hash << 5) - hash + charCode;  // Какй-то простой перевод в хэш
//             hash |= 0;  // Перевод в 32bit
//         }
//         return Math.abs(hash);
//     }

// }

export class Lab_5 {
    constructor() {
        this.openKey = { e: null, n: null };
        this.privateKey = { p: null, q: null, d: null };
    }

    isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    generateRandomPrime(min = 0, max = 500) {
        let prime = 0;
        while (!this.isPrime(prime)) {
            prime = Math.floor(Math.random() * max);
        }
        return prime;
    }
    

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    extendedGcd(a, b) {
        if (a === 0) return { gcd: b, x: 0, y: 1 };
        const { gcd, x: x1, y: y1 } = this.extendedGcd(b % a, a);
        const x = y1 - Math.floor(b / a) * x1;
        const y = x1;
        return { gcd, x, y };
    }

    findModularInverse(e, f) {
        const { gcd, x } = this.extendedGcd(e, f);
        if (gcd !== 1) throw new Error("No modular inverse exists");
        return (x % f + f) % f;
    }

    findE(f) {
        let e = 3;
        while (e < f) {
            if (this.gcd(e, f) === 1) return e;
            e += 2;
        }
        return null;
    }
    
    generateKeys(maxN = 32000) {
        let p = this.generateRandomPrime(); 
        let q = this.generateRandomPrime(); 
        while (p === q) q = this.generateRandomPrime();
        const n = p * q;
        if (n > maxN || n < 1250) {
            return this.generateKeys(maxN); 
        }
    
        const f = (p - 1) * (q - 1);
        const e = this.findE(f);
        const d = this.findModularInverse(e, f);
    
        this.openKey = { e, n };
        this.privateKey = { p, q, d };
    }
    

    modPow(base, exp, mod) {
        let result = 1;
        base = base % mod;
        while (exp > 0) {
            if (exp % 2 === 1) result = (result * base) % mod;
            exp = Math.floor(exp / 2);
            base = (base * base) % mod;
        }
        return result;
    }

    hashMessage(message) {
        let hashValue = 0;
        for (let i = 0; i < message.length; i++) {
            const charCode = message.charCodeAt(i);
            hashValue = ((hashValue << 5) - hashValue + charCode) >>> 0;
        }
        return hashValue;
    }

    signMessage(message, privateKey = this.privateKey) {
        const { p, q, d } = privateKey;
        const n = p * q;
        const messageHash = this.hashMessage(message) % n;
        console.log("Хэш сообщения при подписи (M): " + messageHash)
        return this.modPow(messageHash, d, n);
    }

    verifySignature(message, signature, openKey = this.openKey) {
        const { e, n } = openKey;
        const restoredHash = this.modPow(signature, e, n);
        const messageHash = this.hashMessage(message) % n;
        console.log("________________________________________")
        console.log("Хэш сообщения при проверке подписи (M): " + messageHash);
        console.log("Восстановленный хэш (M'): " + restoredHash)
        return restoredHash == messageHash;
    }

    encryptMessage(message, openKey = this.openKey) {
        const { e, n } = openKey;
        return Array.from(message).map(char => {
            const charCode = char.charCodeAt(0);
            return this.modPow(charCode, e, n);
        });
    }

    decryptMessage(encryptedMessage, privateKey = this.privateKey) {
        const { p, q, d } = privateKey;
        const n = p * q;
        return encryptedMessage.map(num => {
            const decryptedCharCode = this.modPow(num, d, n);
            return String.fromCharCode(decryptedCharCode);
        }).join('');
    }

    numbersToString(nums) {
        return nums.map(num => String.fromCharCode(num)).join('');
    }

    stringToNumbers(str) {
        return Array.from(str).map(char => char.charCodeAt(0));
    }
}