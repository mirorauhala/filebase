import Link from "next/link";
import Image from "next/image";
import { AppLayout } from "@/components/Layouts";
import { GlobalNav } from "@/components/Nav";
import { type GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import {
  type DirectoryListing,
  FileSystemService,
} from "@/services/FileSystemService";
import { redirectTo } from "@/utils/redirect";
import { decode } from "@/support/coding";

type PageProps = {
  fileMetadata: DirectoryListing;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const path = ctx.query.path as string;

  const urn = decode(path);

  const file = await FileSystemService.getFileMetadata(urn);

  if (file.type === "directory") {
    return redirectTo(`/d/${file.urn}`);
  }

  return {
    props: {
      fileMetadata: file,
    } as PageProps,
  };
};

const View: NextPage<PageProps> = ({ fileMetadata }) => {
  return (
    <>
      <Head>
        <title>Filebase</title>
        <meta name="description" content="Filebase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <GlobalNav />
        <main className="flex min-h-screen w-full flex-col">
          <p>file</p>
          <pre>{JSON.stringify(fileMetadata, null, 2)}</pre>

          {/image/.test(fileMetadata.mime || "") && (
            <Image
              src={`/api/raw/${fileMetadata.base64}`}
              alt=""
              width={400}
              height={400}
            />
          )}

          <Link href={`/api/raw/${fileMetadata.base64}`}>Raw</Link>
        </main>
      </AppLayout>
    </>
  );
};

export default View;
