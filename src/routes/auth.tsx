import { Tabs } from 'antd'
import Login from '../feature/auth/components/Login'
import Signup from '../feature/auth/components/Signup'
import { useParams } from 'react-router-dom'

const { TabPane } = Tabs

export function AuthRoute() {
  const { page } = useParams()

  const defaultActiveKey = (() => {
    if (page && page.toLocaleLowerCase() == 'login') {
      return 'signup'
    }
    if (page && page.toLocaleLowerCase() == 'signup') {
      return 'signup'
    }
    return 'login'
  })()

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '50px 20px' }}>
      <Tabs defaultActiveKey={defaultActiveKey} centered>
        <TabPane tab="Login" key="login">
          <Login />
        </TabPane>
        <TabPane tab="Sign Up" key="signup">
          <Signup />
        </TabPane>
      </Tabs>
    </div>
  )
}
