const currentUserString = localStorage.getItem("currentUser");

export const currentUser: any | null = currentUserString
  ? JSON.parse(currentUserString)
  : null;

export const logInToken = localStorage.getItem("logInToken");
