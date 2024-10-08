
export default defineEventHandler(async (event) => {
  const folder_id = getRouterParam(event, 'id')
  console.log(`this is /api/community/${folder_id}`)

  if(folder_id === '123'){
    return 'this api called /api folder'
  } else {
    return 'nothing'
  }
})