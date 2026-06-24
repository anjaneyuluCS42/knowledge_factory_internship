import { useContext } from "react";
import { AuthContext }
from "../context/AuthContext";

function Navbar() {

    console.log("Navbar Rendered");
  const {
    user,
    logout,
  } = useContext(AuthContext);

  return (
    <div>

      <h2>Navbar</h2>

      {user ? (
        <>
          <p>
            Welcome {user.name}
          </p>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <p>
          Not Logged In
        </p>
      )}

    </div>
  );
}

export default Navbar;