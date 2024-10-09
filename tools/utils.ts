
// DB에서 받아온 시간을 일본 시간으로 변경
const convertToJapanTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const jpTime = new Date(date.getTime() + (9 * 60 * 60 * 1000)) // 일본은 UTC+9
  
  const year = jpTime.getUTCFullYear()
  const month = String(jpTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(jpTime.getUTCDate()).padStart(2, '0')
  
  return `${year}/${month}/${day}`
}



export {
  convertToJapanTime
}