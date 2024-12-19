export class Lab_6{
    constructor(keyWord =  "keyWord"){
        this.keyWord = keyWord;
        this.W = 32;
        this.R = 12;
    }

    hash(text = 'ШифрТекст'){
        const textEncoder = new TextEncoder('utf-8');
        const textDecoder = new TextDecoder('utf-8');

        let run = true;
        let H = this.keyWord;
        const textBytes = textEncoder.encode(text);

        for (let i = 0; i < textBytes.length; i += this.W/4) {
            let M = textBytes.slice(i, i + this.W/4);
            // Проверяем, нужно ли дополнить блок
            if (M.length < this.W4) {
                let padding = new Uint8Array(this.W/4 - M.length);
                M = new Uint8Array([...M, ...padding]);  // Дополняем нулевыми байтами
                run = false;
            }
            // console.log(H)
            const Algorithm = new Lab_3({Key: H})
            let encryptedBlock = Algorithm.encryptBlock(M);
            

            let HBytes = this.byteSum(encryptedBlock, M);
            
            // console.log(textDecoder.decode(HBytes), HBytes)
            // H = textDecoder.decode(HBytes);
            H = HBytes;

            if (!run) {
                break;
            }
        }
        return(this.toHexString(H))
    }

    byteSum(arr1, arr2) {
        const length = Math.max(arr1.length, arr2.length);
    
        const result = new Uint8Array(length);
    
        for (let i = 0; i < length; i++) {
          
            const byte1 = arr1[i] || 0;
            const byte2 = arr2[i] || 0;
    
          
            result[i] = (byte1 + byte2) & 0xFF; // Приведение результата в диапазон [0, 255]
        }
    
        return result;
    }

    toHexString(uint8Array) {
        return Array.from(uint8Array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
}



export class Lab_3 {
    constructor({ W = 32, R = 12, Key = "keyWord" } = {}) {
        this.W = this.checkW(W);
        this.W8 = Math.floor(this.W / 8)
        this.W4 = Math.floor(this.W / 4)
        this.R = this.checkR(R);
        this.key = Key;
        // console.log(this.key)
        this.b = Key.length;
        
        if (this.b > 255) {
            throw new Error("Длина ключа превышает 255 символов!")
        }
        
        this.T = 2 * (this.R + 1);
        if (typeof this.key === "string") {
            this.Uint8ArrayKey = new TextEncoder().encode(this.key);
        } else {
            this.Uint8ArrayKey = this.key;
        }
        
        //Константы P и Q
        const [P, Q] = this.generateConstants();
        this.P = P;
        this.Q = Q;

        this.mod = Math.pow(2, this.W);
        this.mask = this.mod-1;
        
        this.c = null;
        this.L = null;

        this.S = [];

        this.keyAlign();
        this.extendedKeyTable();
        this.mixing();

    }
    // Проверка введенного W
    checkW(W) {
        switch (W) {
            case 16:
            case 32:
            case 64:
                return W;
            default:
                throw new Error(`Недопустимое значение W: ${W}. Ожидалось 16, 32 или 64.`);
        }
    }

    // Проверка введенного R
    checkR(R) {
        if (R < 0 || R > 255) {
            throw new Error(`Недопустимое значение R: ${R}. Ожидалось целочисленное значение от 0 до 255.`);
        } else {
            return R;
        }
    }

    //Создаем константы относительно W
    generateConstants() {
        switch (this.W) {
            case 16:
                return [
                    // new Uint8Array([0xB7,0xE1]), 
                    // new Uint8Array([0x9E,0x37])
                    "B7E1", "9E37"
                ]
            case 32:
                return [
                    // new Uint8Array([0xB7,0xE1,0x51,0x63]), 
                    // new Uint8Array([0x9E, 0x37, 0x79, 0xB9])
                    "B7E15163", "9E3779B9"
                ]
            case 64:
                return [
                    // new Uint8Array([0xB7,0xE1,0x51,0x62,0x8A, 0xED, 0x2A, 0x6B]), 
                    // new Uint8Array([0x9E, 0x37, 0x79, 0xB9, 0x7F, 0x4A, 0x7C, 0x15])
                    "B7E151628AED2A6B", "9E3779B97F4A7C15"
                ]
        }
    }

    // Создаем массив слов L с длиной c = b/W8
    keyAlign(){
         //пустой ключ
        if (this.b == 0){
            this.c = 1;
        }
        //ключ не кратен w / 8
        else if (this.b % this.W8 !== 0) {
            const paddingLength = this.W8 - (this.b % this.W8); // Вычисляем, сколько байтов нужно добавить
            const padding = new Uint8Array(paddingLength); // Создаём массив байтов 0x00
            
            // Создаём новый массив, который объединяет исходный массив и байты 0x00
            const extendedKey = new Uint8Array(this.Uint8ArrayKey.length + paddingLength);
            extendedKey.set(this.Uint8ArrayKey); // Копируем исходный массив
            extendedKey.set(padding, this.Uint8ArrayKey.length); // Добавляем нули
            
            this.Uint8ArrayKey = extendedKey;
            this.b = this.Uint8ArrayKey.length; 
            this.c = Math.floor(this.b / this.W8);
        }
        else{
            this.c = this.b; // this.W8
        } 
        //Задаем кол-во элементов массива L
        const L = new Array(this.c);
        //Заполняем массив L
        for (let i = this.b-1; i >= 0; i--){
            L[Math.floor(i / this.W8)] = (L[Math.floor(i / this.W8)] << 8) + this.Uint8ArrayKey[i]
        };
        this.L = L;
    }

    extendedKeyTable(){
        const P = parseInt(this.P, 16);
        const Q = parseInt(this.Q, 16);
        const S = new Array(this.T);
        for (let i = 0; i < this.T; i++){
            S[i] = (P + i * Q) % this.mod;
        };
        this.S = S;
    }

    mixing() {
        let i = 0, j = 0, A = 0, B = 0;
    
        for (let k = 0; k < (3 * Math.max(this.c, this.T)); k++) {
            // >>> 0 для беззнакового 32bit числа, хз как это работает *__*
            A = this.S[i] = this.lshift((this.S[i] + A + B) >>> 0, 3) >>> 0;
            B = this.L[j] = this.lshift((this.L[j] + A + B) >>> 0, (A + B) >>> 0) >>> 0;
            i = (i + 1) % this.T;
            j = (j + 1) % this.c;
        }
    
       
    }
    lshift(val, n) {
        n %= this.W; // Приводим n в диапазон [0, W)
        return ((val << n) | (val >>> (this.W - n))) >>> 0; // Беззнаковый результат
    }

    rshift(val, n) {
        n %= this.W; // Приводим n в диапазон [0, W)
        return ((val >>> n) | (val << (this.W - n))) & this.mask;
    }

    encryptString(text){
        let run = true;
        let encryptedData = new Uint8Array();
        let textBytes = new TextEncoder().encode(text);
        for (let i = 0; i < textBytes.length; i += this.W4) {
            let block = textBytes.slice(i, i + this.W4);
            // Проверяем, нужно ли дополнить блок
            if (block.length < this.W4) {
                let padding = new Uint8Array(this.W4 - block.length);
                block = new Uint8Array([...block, ...padding]);  // Дополняем нулевыми байтами
                run = false;
            }

            let encryptedBlock = this.encryptBlock(block);
            encryptedData = new Uint8Array([...encryptedData, ...encryptedBlock]);

            if (!run) {
                break;
            }
        }
        return encryptedData
    }

    encryptBlock(data) {
        // Разбиваем блок на две части A и B
        let A = this.bytesToInt(data.slice(0, this.W8));
        let B = this.bytesToInt(data.slice(this.W8));

        // Применяем модификации к A и B
        A = (A + this.S[0]) % this.mod;
        B = (B + this.S[1]) % this.mod;

        for (let i = 1; i <= this.R; i++) {
            A = (this.lshift(A ^ B, B) + this.S[2 * i]) % this.mod;
            B = (this.lshift(A ^ B, A) + this.S[2 * i + 1]) % this.mod;
        }

        // Преобразуем A и B обратно в байты и возвращаем зашифрованный блок
        return this.intToBytes(A, this.W8).concat(this.intToBytes(B, this.W8));
    }

    // Преобразование массива байтов в целое число
    bytesToInt(bytes) {
        return bytes.reduce((acc, byte, index) => acc + (byte << (8 * index)), 0);
    }

    // Преобразование целого числа в массив байтов
    intToBytes(value, length) {
        let bytes = new Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = (value >> (8 * i)) & 0xFF;
        }
        return bytes;
    }

    decryptString(encryptedData) {
        let decryptedData = new Uint8Array(); // Для хранения расшифрованных данных
    
        for (let i = 0; i < encryptedData.length; i += this.W4) {
            const block = encryptedData.slice(i, i + this.W4); // Извлекаем текущий блок
            const decryptedBlock = this.decryptBlock(block);  // Расшифровываем блок
            decryptedData = new Uint8Array([...decryptedData, ...decryptedBlock]); // Добавляем расшифрованные данные
        }
    
        // Преобразуем байты обратно в строку, удаляя возможные дополнительные нулевые байты
        return new TextDecoder().decode(decryptedData).replace(/\0+$/, '');
    }
    
    decryptBlock(data) {
        // Разбиваем блок на две части A и B
        let A = this.bytesToInt(data.slice(0, this.W8));
        let B = this.bytesToInt(data.slice(this.W8));
    
        // Применяем обратные операции раундов
        for (let i = this.R; i > 0; i--) {
            B = this.rshift((B - this.S[2 * i + 1] + this.mod) % this.mod, A) ^ A;
            A = this.rshift((A - this.S[2 * i] + this.mod) % this.mod, B) ^ B;
        }
    
        // Убираем начальное прибавление
        B = (B - this.S[1] + this.mod) % this.mod;
        A = (A - this.S[0] + this.mod) % this.mod;
    
        // Преобразование A и B в байты
        return new Uint8Array([...this.intToBytes(A, this.W8), ...this.intToBytes(B, this.W8)]);
    }
    
}