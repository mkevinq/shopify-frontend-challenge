import { DocumentProps, Head, Html, Main, NextScript } from "next/document";
import { FC, ReactElement } from "react";

/**
 * Component containing page metadata.
 *
 * @returns {ReactElement} - HTML Head and Body content.
 */
const Document: FC<DocumentProps> = () => {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Image-sharing from the final frontier!"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
