/*
 * @Author: LinRenJie xoxosos666@gmail.com
 * @Date: 2023-10-25 21:53:39
 * @Description:
 */

// eg: '/user/userList/detail' -> ['/user','/user/UserList','/user/userList/detail']
export function getLevelPaths(path: string) {
  const pathSegments = path.split('/').filter(Boolean)
  const paths = pathSegments.map((_, index) => `/${pathSegments.slice(0, index + 1).join('/')}`)
  return paths
}
