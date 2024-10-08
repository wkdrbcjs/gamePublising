export default defineEventHandler(async (event) => {
	console.log('API /api/hello called')
	return '/server/api/hello.ts!!'
})