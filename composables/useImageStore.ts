
export const useImageStore = () => {
  const supabase_client = useSupabaseClient()
  const imagePath = ref('')
  const imageUrl = ref('')

  const uploadImage = async (file: File) => {
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase_client.storage
      .from('images')
      .upload(fileName, file)

    if (error) throw error

    imagePath.value = data.path
    return data.path
  }

  // musubi라는 버켓에서 가져올 것임.
  const getImageUrl = async (path: string) => {
    const { data } = await supabase_client.storage.from('musubi').getPublicUrl(path)
    imageUrl.value = data.publicUrl
    return data.publicUrl
  }

  const deleteImage = async (path: string) => {
    const { error } = await supabase_client.storage.from('musubi').remove([path])
    if (error) throw error
  }

  return {
    imagePath,
    imageUrl,
    uploadImage,
    getImageUrl,
    deleteImage
  }
}