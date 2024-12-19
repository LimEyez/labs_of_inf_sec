

"use client"

import "@/styles/labs.scss"
import "@/styles/basic.scss"

import { useEffect, useRef, useState } from "react"
import { Lab_6 } from "@/Classes/Lab_6"
import { useRouter } from "next/navigation"


export default function Lab6() {
    const router = useRouter();
    const Algorithm = new Lab_6();

    const refKeyWord = useRef(null);
    const refMessage = useRef(null);
    const refHash = useRef(null);
    const getHash = () => {
        Algorithm.keyWord = refKeyWord.current.value;
        const res = Algorithm.hash(refMessage.current.value);
        refHash.current.value = res;
    }

    return (
        <div className="darkText flex allCenterFlex flexDirrectionColumn">
            <button className="buttonMainMenu" onClick={() => router.push('/')}>Главное меню</button>

            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Введите ключ H_0</p>
                <p>(используется ключ максимальной длины 8 байт)</p>
                <textarea ref={refKeyWord} className="messageTextarea"></textarea>
                <p>Введите сообщение для получения хэша</p>
                <textarea ref={refMessage} className="messageTextarea"></textarea>
            </div>

            <button onClick={getHash} className="standartButton">Получить хэш</button>
        
            <div className="block flex allCenterFlex flexDirrectionColumn ">
                <p>Полученый хэш:</p>
                <textarea ref={refHash}className="messageTextarea"></textarea>
            </div>
        </div>
    )
}