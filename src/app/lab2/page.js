"use client"

import "@/styles/labs.scss"
import "@/styles/basic.scss"

import { useEffect, useRef, useState } from "react"
import { Lab_2 } from "@/Classes/Lab_2"
import { useRouter } from "next/navigation"

export default function Lab2() {
    const router = useRouter();

    const refMessage = useRef(null);
    const refKey = useRef(null);
    const refEncryptedMessage = useRef(null);
    const refDecryptedMessage = useRef(null);
    const refDecryptKeyWord = useRef(null);


    let encryptedMessage = '';
    let key = '';
    let ADFGVXCipher = new Lab_2();

    const handlingError = (error) => {
        if (typeof error.alert == "function") {
            error.alert();
        } else {
            console.log(error.message);
            alert("Произошла непредвиденная ошибка. Подробности в console.log")
        }
    }

    const encryptMessage = () => {
        try {
            key = refKey.current.value;
            ADFGVXCipher.startConfig();
            ADFGVXCipher.setKeyWord(key);
            encryptedMessage = ADFGVXCipher.encrypt(refMessage.current.value);
            refEncryptedMessage.current.value = ADFGVXCipher.getEncryptedMessage();
        } catch (error) {
            handlingError(error)
        }
    }

    const decryptMessage = () => {
        if (refDecryptKeyWord.current.value == '') {
            ADFGVXCipher.decrypt();
        } else {
            ADFGVXCipher.decrypt(refDecryptKeyWord.current.value);
        }
        refDecryptedMessage.current.value = ADFGVXCipher.getDecryptedMessage();
    }

    const updateKeyWord = () => {
        key = refKey.current.value;
        refDecryptKeyWord.current.placeholder = key;
    }

    return (
        <div className="flex allCenterFlex flexDirrectionColumn">
            <button className="buttonMainMenu" onClick={() => router.push('/')}>Главное меню</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите шифруемое сообщение </p>
                <p>используя английские символы и цифры:</p>
                <textarea ref={refMessage} className="messageTextarea"></textarea>
                <p>Введите ключевое слово на английском языке:</p>
                <textarea ref={refKey} onChange={updateKeyWord} className="messageTextarea"></textarea>
                <p>Зашифрованное сообщение:</p>
                <textarea ref={refEncryptedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={encryptMessage} className="standartButton">Зашифровать сообщение</button>


            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите ключевое слово для расшифровки:</p>
                <textarea ref={refDecryptKeyWord} className="messageTextarea"></textarea>
                <p>Расшифрованное сообщение:</p>
                <textarea ref={refDecryptedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={decryptMessage} className="standartButton">Расшифровать сообщение</button>
        </div>
    )
}