import {
  parseFile,
  printAST
} from './ast.js'


const astCache = new Map()



export function createASTSession(file) {

  let cached = astCache.get(file)

  if (!cached) {

    cached = parseFile(file)

    astCache.set(

      file,

      cached

    )

  }

  return {

    file,

    ast: cached.ast,

    source: cached.source,

    changed: false

  }

}



export function finishASTSession(session) {

  if (session.changed) {

    astCache.delete(session.file)

  }

  return {

    changed: session.changed,

    code: session.changed

      ? printAST(session.ast)

      : session.source

  }

}



export function clearASTCache() {

  astCache.clear()

}



export function invalidateAST(file) {

  astCache.delete(file)

}



export function getCachedAST(file) {

  return astCache.get(file)

}