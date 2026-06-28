export const تصدير_الى_PDF = (عنوان, بيانات) => {

  const content =
    JSON.stringify(بيانات, null, 2)

  const blob =
    new Blob([content], {
      type: 'application/pdf'
    })

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url

  link.download =
    `${عنوان}.pdf`

  link.click()

}

export const تصدير_الى_Excel = (عنوان, بيانات) => {

  const content =
    JSON.stringify(بيانات, null, 2)

  const blob =
    new Blob([content], {
      type: 'application/vnd.ms-excel'
    })

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url

  link.download =
    `${عنوان}.xlsx`

  link.click()

}