import { useWebsiteStore } from './store/websiteStore'

export default function TestAuthMigration() {

  const login =
    useWebsiteStore(
      s => s.login
    )

  const logout =
    useWebsiteStore(
      s => s.logout
    )

  const currentUser =
    useWebsiteStore(
      s => s.currentUser
    )

  const setCurrentUser =
    useWebsiteStore(
      s => s.setCurrentUser
    )


  return (
    <div>
      {currentUser?.username}

      <button onClick={logout}>
        Logout
      </button>

      <button
        onClick={() =>
          setCurrentUser(null)
        }
      >
        Clear
      </button>
    </div>
  )

}