'use client'

import { useRouter } from "next/navigation";
import '@/styles/basic.scss'

export default function Home() {
  const router = useRouter();

  const PageOfLabs = [
    {title: 'Одноалфавитное \n шифрование', titleOfLab: 'Lab1', href: 'lab1'},
    {title: 'Шифрование \n ADFGVX', titleOfLab: 'Lab2', href: 'lab2'}
  ]

  return (
    <div className="flex allCenterFlex flexDirrectionRow blockWithBlocksLinks">
      {PageOfLabs.map((element, index) => {
        return(
          <div key={index} className='flex allCenterFlex flexDirrectionColumn blockLink' onClick={() => {router.push(`/${element.href}`)}}>
            <h1>{element.title}</h1>
            <h3>{element.titleOfLab}</h3>
          </div>
        )
      })
      }
    </div>
  )
}