"use client"

import "@/styles/labs.scss"
import "@/styles/basic.scss"

import { useEffect, useRef, useState } from "react"
import { Lab_3 } from "@/Classes/Lab_3"
import { useRouter } from "next/navigation"
import { CustomError } from "@/Classes/CustomError"

export default function Lab3() {
    const router = useRouter();

    let RC5 = null;

    const refW = useRef(null);
    const refR = useRef(null);
    const refKey = useRef(null);
    const refMessage = useRef(null);
    const refEncryptMessage = useRef();
    const refDecryptMessage = useRef(null);

    let encryptedData = null;

    let valueW = 32, valueKey = "keyWord", valueR = 12;


    const encryptMessage = () => {
        try {
            if (RC5 == null){
                throw(new CustomError("Ошибка параметров", "Требуется сохранить параметры шифрования!"))
            } else {
                let encryptedMessage = RC5.encryptString(refMessage.current.value)
                encryptedData = encryptedMessage; // для дешифровки
                let encryptedMessageStr = Array.from(encryptedMessage).map(byte => String.fromCharCode(byte)).join('')
                refEncryptMessage.current.value = encryptedMessageStr
            }
        } catch(e) {
            handlingError(e)
        }
    }

    const decryptMessage = () => {
        try {
            if (RC5 == null){
                throw(new CustomError("Ошибка параметров", "Требуется сохранить параметры шифрования!"))
            } else {
                let encryptedMessageArray = new Uint8Array([...refEncryptMessage.current.value].map(char => char.charCodeAt(0)));
                let decryptedMessage = RC5.decryptString(encryptedData);
                refDecryptMessage.current.value = decryptedMessage
            }
        } catch(e) {
            handlingError(e)
        }
    }

    const saveParams = () => {
        try {
            if (refW.current.value != "16" && refW.current.value != "32" && refW.current.value != "64"){
                throw new CustomError("Ошибка значения W", "W должно быть равно 16, 32 или 64!");
            } else {
                valueW = Number(refW.current.value);
            }
            if (Number(refR.current.value) < 0 || Number(refR.current.value) > 255){
                throw new CustomError("Ошибка значения R", "R должно быть в промежутке [0; 255]!");
            } else {
                valueR = Number(refR.current.value);
            }
            if (refKey.current.value.length > 255) {
                throw new CustomError("Ошибка ключа", "Ключ должен состоять максимум из 255 символов!");
            } 
            else {
                valueKey = refKey.current.value;
            }
            
            RC5 = new Lab_3({ W: valueW, R: valueR, Key: valueKey });
            // console.log(RC5)
        }
        catch(e){
            handlingError(e)
        }
    }

    const handlingError = (error) => {
        if (typeof error.alert == "function") {
            error.alert();
        } else {
            console.log(error.message);
            alert("Произошла непредвиденная ошибка. Подробности в console.log")
        }
    }


    return (
        <div className="darkText flex allCenterFlex flexDirrectionColumn">
            <button className="buttonMainMenu" onClick={() => router.push('/')}>Главное меню</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите значение W (16, 32, 64)</p>
                <textarea ref={refW} className="messageTextarea" defaultValue={valueW}></textarea>
                <p>Введите значение R (0...255)</p>
                <textarea ref={refR} className="messageTextarea" defaultValue={valueR}></textarea>
                <p>Введите ключевое слово:</p>
                <textarea ref={refKey} className="messageTextarea" defaultValue={valueKey}></textarea>
            </div>

            <button onClick={saveParams} className="standartButton">Сохранить параметры</button>


            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите шифруемое сообщение </p>
                <textarea ref={refMessage} className="messageTextarea"></textarea>
                <p>Зашифрованное сообщение:</p>
                <textarea ref={refEncryptMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={encryptMessage} className="standartButton">Зашифровать сообщение</button>

        
            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Расшифрованное сообщение:</p>
                <textarea ref={refDecryptMessage} readOnly={true} className="messageTextarea"></textarea>
            </div>

            <button onClick={decryptMessage} className="standartButton">Расшифровать сообщение</button>

        </div>
    )
}