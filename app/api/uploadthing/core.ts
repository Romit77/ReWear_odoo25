import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth for demo

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }: { req: Request }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: { metadata: { userId: string }; file: { url: string } }) => {
        console.log("Image uploaded", file.url);
        return { uploadedUrl: file.url };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

