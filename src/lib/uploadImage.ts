export async function uploadImage(file: File, uploadUrl: string): Promise<string> {
  if (!file) throw new Error("Image required");
  if (!uploadUrl) throw new Error("Upload URL required");

  if (!file.type.startsWith("image/"))
    throw new Error("Only image files allowed");

  // Increased to 10MB to be safer
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Image max size 10MB");

  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!result.ok) {
    throw new Error(`Upload failed: ${result.statusText}`);
  }

  const { storageId } = await result.json();
  return storageId;
}
