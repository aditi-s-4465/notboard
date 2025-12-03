
import {useContext} from 'react'

import { AppContext } from './appcontext'



export const useAppContext = () => {

  return useContext(AppContext)

}