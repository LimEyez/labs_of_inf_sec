"use client"

import "@/styles/labs.scss"
import "@/styles/basic.scss"

import { useEffect, useRef } from "react"
import { Lab_1 } from "@/Classes/Lab_1.js"
import { CustomError } from "@/Classes/CustomError"
import { useRouter } from "next/navigation"

export default function Lab1() {
    const router = useRouter();


    const refMessage = useRef(null);
    const refKey = useRef(null);
    const refEncryptedMessage = useRef(null);
    const refDecryptedMessage = useRef(null);
    const refCrackedMessage = useRef(null);

    const monoAlphaBetCipher = new Lab_1();
    let key = '';
    let encryptedMessage = '';
    let decryptedMessage = '';
    let crackedMessage = '';

    const updatePageParams = () => {
        refKey.current.value = key;
        refEncryptedMessage.current.value = encryptedMessage;
        refDecryptedMessage.current.value = decryptedMessage;
        refCrackedMessage.current.value = crackedMessage;
    };

    const handlingError = (error) => {
        if (typeof error.alert == "function") {
            error.alert();
        } else {
            console.log(error.message);
            alert("Произошла непредвиденная ошибка. Подробности в console.log")
        }
    }

    const createKey = () => {
        monoAlphaBetCipher.generateKey();
        key = monoAlphaBetCipher.getKey();
        refKey.current.value = key;
    };

    const encryptMessage = () => {
        try {
            encryptedMessage = monoAlphaBetCipher.encrypt(refMessage.current.value);
            refEncryptedMessage.current.value = encryptedMessage
        } catch (error) {
            handlingError(error)
        }
    };

    const decryptMessage = () => {
        try {
            decryptedMessage = monoAlphaBetCipher.decrypt(refEncryptedMessage.current.value);
            refDecryptedMessage.current.value = decryptedMessage;
        }
        catch (error) {
            handlingError(error);
        }
    };

    const crackMessage = () => {
        crackedMessage = monoAlphaBetCipher.crackMessage(refEncryptedMessage.current.value);
        refCrackedMessage.current.value = crackedMessage;
    };

    const deleteOtherSymbols = () => {
        refMessage.current.value = refMessage.current.value.replace(/[^А-Яа-яЁё.,!?\";:( )\-]/g, '');
    };

    const convertToUpperCase = () => {
        refMessage.current.value = refMessage.current.value.toUpperCase();
    };

    useEffect(() => {
        updatePageParams();
    });


    return (
        <div className="flex allCenterFlex flexDirrectionColumn blockWithBlocks">
            <button className="buttonMainMenu" onClick={() => router.push('/')}>Главное меню</button>
            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите шифруемое сообщение с помощью символов:</p>
                <p style={{ color: 'rgb(193, 193, 255)' }}>АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ,.-?!\";:)(</p>
                <textarea ref={refMessage} onChange={convertToUpperCase} className="messageTextarea"></textarea>
            </div>

            <button onClick={deleteOtherSymbols} className="standartButton">Убрать лишние символы</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Ключ:</p>
                <textarea ref={refKey} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={createKey} className="standartButton">Создать ключ</button>


            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Зашифрованное сообщение:</p>
                <textarea ref={refEncryptedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={encryptMessage} className="standartButton">Зашифровать сообщение</button>


            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Расшифрованное сообщение:</p>
                <textarea ref={refDecryptedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={decryptMessage} className="standartButton">Расшифровать сообщение</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Крякнутое сообщение:</p>
                <textarea ref={refCrackedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={crackMessage} className="standartButton">Крякнуть сообщение</button>

        </div>
    )
}