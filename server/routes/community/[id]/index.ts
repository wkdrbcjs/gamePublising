
export default defineEventHandler(async (event) => {
  const folder_id = getRouterParam(event, 'id')
  console.log(`this is /routes/community/${folder_id}`)

  if(folder_id === '123'){
    return 'this api called /routes folder'
  } else {
    return 'nothing'
  }
})