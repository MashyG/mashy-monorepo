module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    let https = require('https')
    let http = require('http')

    // 1. 拦截 CDN 请求
    build.onResolve(
      { filter: /^https?:\/\//, namespace: 'http-url' },
      (args) => ({
        // path: args.path,
        // 重写路径
        path: new URL(args.path, args.importer).toString(), // 除了要解析 react-dom 这种直接依赖的路径，还要解析它依赖的路径，也就是间接依赖的路径
        namespace: 'http-url'
      })
    )

    // 2. 通过 fetch 请求加载 CDN 资源
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`)
          let lib = url.startsWith('https') ? https : http
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString())
                req.abort()
              } else if (res.statusCode === 200) {
                // 响应成功
                let chunks = []
                res.on('data', (chunk) => chunks.push(chunk))
                res.on('end', () => resolve(Buffer.concat(chunks)))
              } else {
                reject(new Error(`GET ${url} failed: status ${res.statusCode}`))
              }
            })
            .on('error', reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  }
})
