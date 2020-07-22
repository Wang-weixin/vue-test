const getters = {
  language: state => state.app.language,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  ip: state => state.user.ip,
  port: state => state.user.port,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menu: state => state.permission.menu,
  errorLogs: state => state.errorLog.logs
}
export default getters
