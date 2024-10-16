const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth";
};

export { handleLogout };
