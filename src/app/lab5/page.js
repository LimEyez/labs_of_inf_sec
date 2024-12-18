

"use client"

import "@/styles/labs.scss"
import "@/styles/basic.scss"

import { useEffect, useRef, useState } from "react"
import { Lab_5 } from "@/Classes/Lab_5"
import { useRouter } from "next/navigation"


export default function Lab3() {
    const router = useRouter();

    const Algorithm = new Lab_5();

    let startMessage = '';
    let signedMessage = '';
    let verificatedMessage = '';
    const encryptedMessage={num: [], str: ''};
    const decryptedMessage={num: [], str: ''};

    const refPrivateKey = useRef(null); 
    const refOpenKey = useRef(null); 
    const refStartMessage = useRef(null);
    const refEncryptedMessage = useRef(null);
    const refDecryptedMessage = useRef(null);
    const refVerificatedMessage = useRef(null);
    const refSignedMessage = useRef(null);
    const refResVerificateMessage = useRef(null);

    useEffect(() => {
        updateValuesKeys();
    })

    const createKeys = () => {
        Algorithm.generateKeys();
        updateValuesKeys();
    }

    const updateValuesKeys = () => {
        refOpenKey.current.innerText = "e: " + Algorithm.openKey.e + "; n: " + Algorithm.openKey.n;
        refPrivateKey.current.innerText = "p: " + Algorithm.privateKey.p + "; n: " + Algorithm.privateKey.q + "; d: " + Algorithm.privateKey.d;
    }

    const encryptMessage = () => {
        encryptedMessage.num = Algorithm.encryptMessage(startMessage);
        encryptedMessage.str = Algorithm.numbersToString(encryptedMessage.num);
        refEncryptedMessage.current.value = encryptedMessage.str;
    }

    const signMessage =() => {
        signedMessage = Algorithm.signMessage(startMessage);
        refSignedMessage.current.value = signedMessage;
    }

    const verificateMessage = () => {
        verificatedMessage = Algorithm.verifySignature(refDecryptedMessage.current.value, refSignedMessage.current.value);
        refVerificatedMessage.current.value = verificatedMessage;
        
        if (verificatedMessage){
            refResVerificateMessage.current.innerText = 'Проверка прошла успешно!'
        } else {
            refResVerificateMessage.current.innerText = 'Сообщение было изменено!'
        }
        
    }

    const decryptMessage = () => {
        decryptedMessage.str = Algorithm.decryptMessage(Algorithm.stringToNumbers(refEncryptedMessage.current.value));
        refDecryptedMessage.current.value = decryptedMessage.str;
    }

    return (
        <div className="darkText flex allCenterFlex flexDirrectionColumn">
            <button className="buttonMainMenu" onClick={() => router.push('/')}>Главное меню</button>

            <button onClick={createKeys} className="standartButton">Создать ключи шифрования</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Закрытый ключ:</p>
                <p ref={refPrivateKey}></p>
                <p>Открытый ключ:</p>
                <p ref={refOpenKey}></p>

            </div>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите шифруемое сообщение:</p>
                <textarea ref={refStartMessage} onChange={() => {startMessage = refStartMessage.current.value}} className="messageTextarea"></textarea>
                <p>Зашифрованное сообщение:</p>
                <textarea ref={refEncryptedMessage} className="messageTextarea"></textarea>
            </div>

            <button onClick={encryptMessage} className="standartButton">Зашифровать сообщение</button>
        
            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Расшифрованное сообщение:</p>
                <textarea ref={refDecryptedMessage}className="messageTextarea"></textarea>
            </div>

            <button onClick={decryptMessage} className="standartButton">Расшифровать сообщение</button>
            <p>_________________________________________________________</p>
            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Сигнатура:</p>
                <textarea ref={refSignedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={signMessage} className="standartButton">Подписать</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Проверенная сигнатура:</p>
                <textarea ref={refVerificatedMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={verificateMessage}  className="standartButton">Проверка подписи</button>

            <p ref={refResVerificateMessage}></p>
        </div>
    )
}