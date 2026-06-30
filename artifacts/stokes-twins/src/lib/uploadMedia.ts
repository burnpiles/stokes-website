import { useQueryClient } from "@tanstack/react-query";
import {
  useRequestUploadUrl,
  useCreateMedia,
  getListMediaQueryKey,
  getGetContentQueryKey,
} from "@workspace/api-client-react";
import type { Media } from "@workspace/api-client-react";

export function mediaUrl(objectPath: string): string {
  return `/api/storage${objectPath}`;
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  const requestUrl = useRequestUploadUrl();
  const createMedia = useCreateMedia();

  async function uploadFile(file: File): Promise<Media> {
    const { uploadURL, objectPath } = await requestUrl.mutateAsync({
      data: { name: file.name, size: file.size, contentType: file.type || "application/octet-stream" },
    });

    const put = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });
    if (!put.ok) {
      throw new Error(`Upload failed (${put.status})`);
    }

    const media = await createMedia.mutateAsync({
      data: {
        filename: file.name,
        objectPath,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      },
    });

    await queryClient.invalidateQueries({ queryKey: getListMediaQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getGetContentQueryKey() });
    return media;
  }

  return { uploadFile, isUploading: requestUrl.isPending || createMedia.isPending };
}
