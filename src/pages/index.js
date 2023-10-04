import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import TypingAnimation from '../components/TypingAnimation'

const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  const [inputValue, setInputValue] = useState('')
  const [chatLog, setChatLog] = useState([
    // {
    //   type: 'user',
    //   message: 'hi'
    // },
    // {
    //   type: 'assistant',
    //   message: 'hello'
    // }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()

    setChatLog(prevChatLog => [
      ...prevChatLog,
      { type: 'user', message: inputValue }
    ])

    sendMessage(inputValue)

    setInputValue('')
  }

  const sendMessage = message => {
    const url = '/api/chat'

    const allMessages = [
      {
        role: 'system',
        content:
          "You are EchoDost, a very friendly and helpful chatbot to help students of ECHO program. An ECHO BOOTCAMP program is being conducted on 03rd and 4th October 2023, in Govt City College, Hyderabad. Students of this college will be seeking your help. \n\nYou should encourage students to ask as many relevant questions about the program and about this years theme (which is SDG 11) and about some ideas. Your main goal is to help them to tinker upon ideas which they can implement. Do not engage yourself in any other kind of conversation which is not relevant to the ECHO program. Use shorter sentences initially.\n\nWhenever a new student comes to you, you will get 'Hi' as message. In that case Greet students with your name, and ask student to enter his/her name, and then encourage him to ask you questions. Guide them with some sample questions which they can ask you. These students might be little shy to use an intelligent chatbot like you, so make them feel comfortable by engaging them in different creative ways. Re-iterate and remind the students every now and then that you are here to help them to come up with ideas for the project. Keep pushing them to think of some ideas and discuss about them with you.\n\nWhenever a student ask you a question, first ensure this question is related to ECHO program. If not, do not engage in this conversation and request the student to only have conversation related to ECHO program.\n\nFollowing 4 questions and answers provides you the information you need to know:\n\nQuestion 1: What is ECHO?\nAnswer:\n    * ECHO x YOU(th) - Every year, WWF-India hosts a National Summit. Here university student teams showcase the impact of their work, which is evaluated by a panel of experts. By participating in ECHO, young people enhance their skills of leadership, networking, project development, planning and management, communication, and negotiation. They further contribute to Sustainable Development Goals by creating social, economic and environmental impact through their ECHO projects.\n    * Vision of ECHO program - To mentor young people to utilize innovation and entrepreneurial skills to catalyze positive change and create an environmental impact.\n    * ECHO is an annual innovation platform that runs through the academic year and leads to a National Summit and a rolling Panda Trophy. \n    * At the beginning of the ECHO journey, a core team of students - representing their college, is trained in teamwork, project management, and business canvas development and familiarized with the theme of the year. Each team conducts a need assessment, defines one or more problem statements, devises innovative solutions aligned with the year's theme, and takes action to test it.\n    * The impact created by the teams' initiatives is reviewed by a panel of experts on the parameters of innovation, scalability, impact, feasibility, and business model.\n    * ECHO inspires and mentors youth to explore their local environments, innovate and transform their ideas into impactful environmental ventures.\n    * ECHO's full form is 'Building Environment Conservation Heros'\n\nQuestion 2: Steps in the ECHO Journey?\nAnswer:\n    a- College registration\n    b- Core team formation\n    c- Echo forum\n    d- Incubation\n    e- Implementation\n    f- State level elimination\n    g- National echo summit\n\nQuestion 3. Theme of ECHO 2023\nAnswer:\n    * The themes for the ECHO programme (ECHO Action Statement) are aligned with the Sustainable Development Goals (SDGs) and focus on prevailing and pressing environmental issues. WWF-India announces a new theme for ECHO every year.\n    * The theme of ECHO 2023 will involve college students in innovating and taking action to advance Sustainable Development Goal 11- Sustainable Cities and Communities.\n\nQuestion 4: What will YOU(th) gain?\nAnswer:    * Earn the title of ECHO Conservation Hero and a rolling Panda Trophy for acing the National Level.\n    * Earn certificates & goodies as best achiever - State Level.\n    * Team members may earn e-certificates of participation for supporting the core team in ECHO Projects."
      }
    ]

    chatLog.forEach(log => {
      allMessages.push({ role: log.type, content: log.message })
    })

    allMessages.push({ role: 'user', content: message })

    console.log(allMessages)

    const data = {
      model: 'gpt-3.5-turbo-0301',
      // messages: [{ "role": "user", "content": message }]
      messages: allMessages
    }

    setIsLoading(true)

    axios
      .post(url, data)
      .then(response => {
        console.log(response)
        setChatLog(prevChatLog => [
          ...prevChatLog,
          // { type: 'bot', message: response.data.choices[0].message.content }
          {
            type: 'assistant',
            message: response.data.choices[0].message.content
          }
        ])
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
        console.log(error)
      })
  }

  return (
    <div className='container mx-auto max-w-[700px] bg-gray-900'>
      <div
        className='flex flex-col h-screen bg-gray-900'
        // style={{ height: !!chatLog.length ? '100%' : '90%' }}
      >
        <h1 className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl'>
          EchoDost ChatBot
        </h1>

        {!chatLog.length ? (
          <div
            className='text-center text-white p-6'
            // style={{ marginTop: '15%', marginBottom: '20%' }}
          >
            <p>Say Hi! to start chatting with the bot.</p>
            <p className='p-6'>Made by Ram for WWF-India.</p>
            <p>
              Source code at{' '}
              <a
                href='https://github.com/gurumukhi/EchoDostChatBot/'
                target='_blank'
              >
                https://github.com/gurumukhi/EchoDostChatBot/
              </a>
            </p>
          </div>
        ) : (
          <div
            className='flex-grow p-6 mainDiv'
            style={{ overflowY: 'scroll' }}
          >
            <div className='flex flex-col space-y-4'>
              {chatLog.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`${
                      message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
                    } rounded-lg p-4 text-white max-w-sm`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div key={chatLog.length} className='flex justify-start'>
                  <div className='bg-gray-800 rounded-lg p-4 text-white max-w-sm'>
                    <TypingAnimation />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className='flex-none p-6'
          style={{ marginBottom: !chatLog.length ? '10%' : '0px' }}
        >
          <div className='flex rounded-lg border border-gray-700 bg-gray-800'>
            <input
              type='text'
              className='flex-grow px-4 py-2 bg-transparent text-white focus:outline-none'
              placeholder='Type your message...'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <button
              type='submit'
              className='bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300'
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
