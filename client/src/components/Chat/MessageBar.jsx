import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import { ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import EmojiPicker from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
// import { FaMicrophone } from 'react-icons/fa'

const MessageBar = () => {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider()
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== 'emoji-open') {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target)
        ) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }
  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji))
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await sendMessage()
    }
  }
  const sendMessage = async () => {
    try {
      console.log(userInfo, currentChatUser, message)
      console.log(ADD_MESSAGE_ROUTE)
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message
      })
      socket.current.emit('send-msg', {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message
      })

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: { ...data.message },
        fromSelf: true
      })

      setMessage('')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='bg-panel-header-background h-20 px-4 flex items-center gap-6 relative '>
      <>
        <div className='flex gap-6'>
          <BsEmojiSmile
            className='text-panel-header-icon text-xl cursor-pointer'
            title='Emoji'
            id='emoji-open'
            onClick={handleEmojiModal}
          />
          {showEmojiPicker && (
            <div
              className='absolute bottom-24 left-16 z-40'
              ref={emojiPickerRef}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme='dark'
                emojiStyle='apple'
              />
            </div>
          )}
          <ImAttachment
            className='text-panel-header-icon text-xl cursor-pointer'
            title='Attach File'
          />
        </div>
        <div className='w-full rounded-lg h-10 flex items-center text-white'>
          <input
            type='text'
            placeholder='Type a message'
            className='bg-input-background text-sm focus:outline-none textwhite h-10 w-full px-5 py-4 rounded-lg'
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            value={message}
          />
        </div>
        <div className='flex w-10 items-center justify-center'>
          <button>
            <MdSend
              className='text-panel-header-icon text-xl cursor-pointer'
              title='Send message'
              onClick={sendMessage}
            />
            {/* <FaMicrophone
              className='text-panel-header-icon text-xl cursor-pointer'
              title='Record'
            /> */}
          </button>
        </div>
      </>
    </div>
  )
}

export default MessageBar
