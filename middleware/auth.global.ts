// 具名的中间件
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAccessToken, setAccessToken } = useAuthStore()
  const router = useRouter()
  const { fetchInfo } = usePlayerStore()
  const { queryInfo } = useSiteStore()
  const { isLogin } = useAuthStore()
  // siteData
  // demo router
  if (
    from.fullPath.indexOf('model') > -1 &&
    to.fullPath.indexOf('model') === -1
  ) {
    const fromParts = from.name.split('-')
    if (fromParts.length > 1 && to.name !== 'index') {
      const result = fromParts[1]
      if (to.fullPath.indexOf('user') === -1) {
        return navigateTo(`/${to.name}/${result}`)
      } else {
        const toParts = to.fullPath.split('/')
        if (to.fullPath === '/user') {
          return navigateTo(`${to.fullPath}/${result}`)
        } else if (toParts.length > 2) {
          return navigateTo(`/${toParts[1]}/${result}/${toParts[2]}`)
        }
      }
    }
  }
  const accessTokenCookiee = useCookie('accessToken', {
    expires: new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000) // 1 week from now
  }) as any
  const redirectUrlCookie = useCookie('redirectUrl', {
    expires: new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000) // 1 week from now
  }) as any

  // siteData
  if (process.server) {
    await queryInfo()
    // step1 : check query has accessToken or not, yes then set accessToken to cookie and store
    if (isLogin()) {
      console.table({
        queryToken: !!accessTokenCookiee,
        cookieeToken: !!isLogin(),
        toPath: to.path
      })
      // playerData

      if (!(await checkAccessToken())) {
        redirectUrlCookie.value = to.fullPath
      } else {
        await fetchInfo()
      }
    } else {
      console.table({
        queryToken: !!accessTokenCookiee,
        cookieeToken: !!isLogin(),
        toPath: to.path
      })
      if (to.path.includes('game')) {
        return navigateTo(`/login`)
      }
      if (to.path.includes('user')) {
        return navigateTo(`/login`)
      }
    }
  }

  if (process.client) {
    const accessTokenQuery = to.query.accessToken
    if (accessTokenQuery) {
      console.table({
        queryToken: !!accessTokenQuery,
        cookieeToken: !!isLogin(),
        toPath: to.path
      })

      setAccessToken(accessTokenQuery)
      if (await checkAccessToken(accessTokenQuery)) {
        // replace url without accessToken
        const newQuery = { ...to.query }
        delete newQuery.accessToken
        router.replace({ path: to.path, query: newQuery })
      } else {
        redirectUrlCookie.value = to.fullPath
      }
    } else if (!isLogin()) {
      console.table({
        queryToken: !!accessTokenCookiee,
        cookieeToken: !!isLogin(),
        toPath: to.path
      })
      if (to.path.includes('game')) {
        return navigateTo(`/login`)
      }
      if (to.path.includes('user')) {
        return navigateTo(`/login`)
      }
    } else if (isLogin()) {
      queryInfo()
      fetchInfo()
    }
  }
})
