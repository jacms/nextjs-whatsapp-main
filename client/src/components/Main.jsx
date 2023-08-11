import { onAuthStateChanged } from 'firebase/auth'
import ChatList from './Chatlist/ChatList'
import Empty from './Empty'
import { firebaseAuth } from '@/utils/FirebaseConfig'
import { useEffect, useRef, useState } from 'react'
import { useStateProvider } from '@/context/StateContext'
import axios from 'axios'
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from '@/utils/ApiRoutes'
import { useRouter } from 'next/router'
import { reducerCases } from '@/context/constants'
import Chat from './Chat/Chat'
import { io } from 'socket.io-client'

const Main = () => {
  const router = useRouter()
  const [redirectLogin, setRedirectLogin] = useState(false)
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider()
  const [socketEvent, setSocketEvent] = useState(false)
  const socketRef = useRef()

  useEffect(() => {
    if (redirectLogin) {
      router.push('/login')
    }
  }, [redirectLogin])

  onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
      setRedirectLogin(true)
    }
    if (!userInfo && user?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, { email: user.email })
      if (!data.status) {
        router.push('/login')
      }
      if (data?.data) {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status
        } = data.data

        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status
          }
        })
      }
    }
  })

  // socket connection
  useEffect(() => {
    if (userInfo) {
      socketRef.current = io(HOST)
      socketRef.current.emit('add-user', userInfo.id)
      dispatch({
        type: reducerCases.SET_SOCKET,
        socket: socketRef
      })
    }
  }, [userInfo])

  useEffect(() => {
    if (socketRef.current && !socketEvent) {
      socketRef.current.on('msg-receive', (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...data.message }
        })
      })
      setSocketEvent(true)
    }
  }, [socketRef.current])

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages }
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`
      )
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages
      })
    }
    if (currentChatUser?.id) {
      getMessages()
    }
  }, [currentChatUser])

  return (
    <>
      <div className='grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden'>
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  )
}

export default Main
