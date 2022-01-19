import React from "react";

function Profile(props, onDelete) {
  const [formState, setFormState] = React.useState({
    name: props.user.name,
    email: props.user.email,
    password: props.user.password,
  });

  onDelete = () => {
    alert(" Prepare to be terminated");
  };

  const handleEditSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // 1. POST our new user info to the server
      const fetchResponse = await fetch(
        `/api/users/61e786740d1fd9da12fefcb4/edit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            password: formState.password,
          }),
        }
      );

      // 2. Check "fetchResponse.ok". False means status code was 4xx from the server/controller action
      if (!fetchResponse.ok) throw new Error("Fetch failed - Bad request");

      let token = await fetchResponse.json(); // 3. decode fetch response to get jwt from srv
      localStorage.setItem("token", token); // 4. Stick token into localStorage

      const userDoc = JSON.parse(atob(token.split(".")[1])).user; // 5. Decode the token + put user document into state
      props.setUserInState(userDoc);
    } catch (err) {
      console.log("Edit Form error", err);
    }
  };

  const handleChange = (evt) => {
    setFormState({
      ...formState,
      [evt.target.name]: evt.target.value,
      error: "",
    });
  };

  return (
    <div>
      <form onSubmit={handleEditSubmit}>
        <label>
          <span>Name</span>
          <input
            name="name"
            defaultValue={props.user.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            defaultValue={props.user.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            defaultValue={props.user.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Edit User</button>
      </form>
      <button onClick={onDelete}>Delete User</button>
    </div>
  );
}

export default Profile;
