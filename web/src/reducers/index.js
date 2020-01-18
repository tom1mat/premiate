const initialState = {
    isSignedIn: false,
    hasLoadedUserData: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
      case 'LOG_IN':
        return {
          ...state,
          isSignedIn: true
        }
      case 'LOG_OUT':
        return {
          ...state,
          isSignedIn: false
        }
      case 'SET_USER_DATA':
        return {
          ...state,
          userData: action.payload
        }
      case 'SET_JWT_TOKEN':
        return {
          ...state,
          jwtToken: action.payload
        }
      case 'SET_HAS_LOADED_USER_DATA':
        return {
          ...state,
          hasLoadedUserData: true,
        }
      case 'SET_AUTH2':
        return {
          ...state,
          auth2: action.payload,
        }
      default:
        return state
    }
}