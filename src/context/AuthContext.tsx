import { useReducer, createContext, ReactNode } from 'react'
import { User } from '@/types/auth'
import { SET_USER_INFO, LOCALSTORAGE_KEYS } from '@/lib/constants'

interface AuthState {
    user: User | null;
}

interface AuthAction {
    type: string;
    payload: {
        user: User;
        auth: boolean;
    };
}

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

const initialState: AuthState = {
    user: null
}

const appReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case SET_USER_INFO:
            window.localStorage.setItem(LOCALSTORAGE_KEYS.AUTHENTICATED, String(action.payload.auth))
            return {
                ...state,
                user: action.payload.user
            }
        default:
            return state
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const value = { state, dispatch }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export { AuthContext, AppProvider }