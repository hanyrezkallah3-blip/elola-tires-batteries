import { useUserStore } from "./store/userStore";
export default function TestAuthMigration() {
  const login = useUserStore(s => s.login);
  const logout = useUserStore(s => s.logout);
  const currentUser = useUserStore(s => s.currentUser);
  const setCurrentUser = useUserStore(s => s.setCurrentUser);
  return <div>
      {currentUser?.username}

      <button onClick={logout}>
        Logout
      </button>

      <button onClick={() => setCurrentUser(null)}>
        Clear
      </button>
    </div>;
}