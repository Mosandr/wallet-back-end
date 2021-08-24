const getDay = timeStamp => {
  const date = new Date(timeStamp)
  return date.getDate().toString()
}
const getMonth = timeStamp => {
  const date = new Date(timeStamp)
  return (date.getMonth() + 1).toString().padStart(2, '0')
}
const getYear = timeStamp => {
  const date = new Date(timeStamp)
  return date.getFullYear().toString()
}

const getDate = timeStamp => {
  const day = getDay(timeStamp)
  const month = getMonth(timeStamp)
  const year = getYear(timeStamp)
  return `${day}.${month}.${year}`
}

module.exports = {
  getDate,
  getDay,
  getMonth,
  getYear,
}
