import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import { GET_CONTACTS_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi'
import ChatLIstItem from './ChatLIstItem'

const ContactsList = () => {
  const [dispatch] = useStateProvider()
  const [allContacts, setAllContacts] = useState([])
  useEffect(() => {
    try {
      const getContacts = async () => {
        const {
          data: { users }
        } = await axios.get(GET_CONTACTS_ROUTE)
        setAllContacts(users)
      }
      getContacts()
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div className='h-full flex flex-col'>
      <div className='flex h-24 items-end px-3 py-4'>
        <div className='flex items-center gap-12 text-white'>
          <BiArrowBack
            className='cursor-pointer text-xl'
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span className='text-xl'>New Chat</span>
        </div>
      </div>
      <div className='bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar'>
        <div className='flex py-3 items-center gap-3 h-14 '>
          <div className='bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4'>
            <div>
              <BiSearchAlt2 className='text-panel-header-icon text-l cursor-pointer' />
            </div>
            <div>
              <input
                type='text'
                placeholder='Search contacts'
                className='bg-transparent text-sm focus:outline-none text-white w-full'
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className='text-teal-light pl-10 py-5'>
                {initialLetter.toUpperCase()}
              </div>
              {userList.map((user) => {
                return (
                  <ChatLIstItem
                    key={user.id}
                    data={user}
                    isContactPage={true}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactsList
