
import './App.css'
import { useUsers } from './module/user/hooks/use-hook'
import AuthPage from './module/auth/pages/auth'

function App() {
  const { data: users } = useUsers();
  console.log(users);
  return (
    <>
    <AuthPage/>
    </>
  )
}

export default App
