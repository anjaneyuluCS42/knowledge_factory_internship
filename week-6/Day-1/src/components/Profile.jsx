import { useContext } from "react";

import { AuthContext }
from "../context/AuthContext";

function Profile() {
    console.log("Profile Rendered");

  const {
    user,
    login,
  } = useContext(AuthContext);

  return (
    <div>

      <h2>Profile</h2>

      {user ? (
        <>
          <p>
            Name:
            {user.name}
          </p>

          <p>
            Email:
            {user.email}
          </p>
        </>
      ) : (
        <button
          onClick={login}
        >
          Login
        </button>
      )}

    </div>
  );
}

export default Profile;