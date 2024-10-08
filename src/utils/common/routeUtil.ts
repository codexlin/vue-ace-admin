// eg: '/user/userList/detail' -> ['/user','/user/UserList','/user/userList/detail']
export function getLevelPaths(path: string) {
  const pathSegments = path.split('/').filter(Boolean)
  const paths = pathSegments.map((_, index) => `/${pathSegments.slice(0, index + 1).join('/')}`)
  return paths
}

export function flattenRoutes(routes: Routes) {
  const flattenedRoutes: Routes = []

  function flatten(route: Routes) {
    route.forEach((r) => {
      const flattenedRoute = { ...r }
      flattenedRoutes.push(flattenedRoute)

      if (r.children) {
        flatten(r.children)
      }
    })
  }
  flatten(routes)
  return flattenedRoutes
}
