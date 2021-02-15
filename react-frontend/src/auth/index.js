import { createAuthProvider } from 'react-token-auth'

/*
    Code here (and most other authentication code) taken from: https://yasoob.me/posts/how-to-setup-and-deploy-jwt-auth-using-react-and-flask/
    I don't really understand the library, but here's more info: https://www.npmjs.com/package/react-token-auth/v/1.1.7
*/

export const [useAuth, authFetch, login, logout] = createAuthProvider({
    accessTokenKey: 'access_token',
    onUpdateToken: (token) => fetch('/api/refresh', {
        method: 'POST',
        body: token.access_token
    }).then(r => r.json())
});