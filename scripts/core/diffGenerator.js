import fs from 'fs'


export function generateDiff(

  oldCode,

  newCode

) {


  const oldLines =

    oldCode.split('\n')



  const newLines =

    newCode.split('\n')



  const diff = []



  const max = Math.max(

    oldLines.length,

    newLines.length

  )



  for (let i = 0; i < max; i++) {


    const oldLine = oldLines[i]

    const newLine = newLines[i]



    if (oldLine !== newLine) {


      diff.push({

        line: i + 1,

        before: oldLine || '',

        after: newLine || ''

      })


    }


  }



  return diff

}



export function saveDiffPreview(

  file,

  diff

) {


  return {

    file,

    changes: diff.length,

    diff

  }

}