import os from 'os'



export async function runWorkerPool(

  items,

  worker,

  options = {}

) {

  const concurrency =

    options.concurrency ||

    Math.max(

      1,

      os.cpus().length - 1

    )



  let index = 0



  async function next() {

    while (true) {

      const current = index++

      if (current >= items.length)
        return

      await worker(

        items[current],

        current

      )

    }

  }



  const workers = []



  for (

    let i = 0;

    i < concurrency;

    i++

  ) {

    workers.push(

      next()

    )

  }



  await Promise.all(

    workers

  )

}