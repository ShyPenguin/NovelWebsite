import { auth, docs } from "@googleapis/docs";
import { ServiceResult } from "../../types/index.ts";
import {
  extractDocumentStructure,
  extractGoogleDocId,
  Paragraph,
} from "../../utils/googleDoc.ts";
import { convertToHTML } from "../../utils/convertToHTML.ts";
import {
  BaseError,
  CustomizedAuthorizationError,
  CustomizedNotFoundError,
  ValidationError,
} from "@/utils/error.ts";

type Data = {
  title: string;
  plainText: string;
  contentHtml: string;
};

export const previewChapterService = async (docUrl: string): Promise<Data> => {
  const documentId = extractGoogleDocId(docUrl);
  if (!documentId) {
    throw new ValidationError("There's no document ID inside the url");
  }

  // 2. Authenticate and create the Docs API client
  // Important: The 'auth' client needs to be created with valid credentials
  // I use a service account key file (common for server-to-server).
  // You must set the GOOGLE_APPLICATION_CREDENTIALS environment variable
  // or provide the key file path.
  const authRes = new auth.GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/documents.readonly"], // Read-only scope
  });

  const authClient = await authRes.getClient();

  // Create the Docs API client
  // @ts-expect-error
  const client = docs({
    version: "v1",
    auth: authClient,
  });

  // 3. Fetch the document using the Docs API
  try {
    const docResponse = await client.documents.get({
      documentId: documentId,
    });

    // 4. Process the document content
    // The content is a nested structure of objects. The main text is in the 'body' segment.
    const document = docResponse.data;
    const title = document.title || "Untitled";

    // Use the structured extractor
    let structuredContent: Paragraph[] = [];
    if (document.body && document.body.content) {
      structuredContent = extractDocumentStructure(document.body.content);
    }

    // plain text
    const plainText = structuredContent
      .map((p) => p.segments.map((s) => s.text).join(""))
      .join("\n");

    const contentHtml = convertToHTML(structuredContent);

    return {
      title: title,
      plainText: plainText,
      contentHtml,
    };
  } catch (err: any) {
    if (err.code === 404 || err.response?.status === 404) {
      throw new CustomizedNotFoundError(
        "Google Doc not found. Check the document ID.",
      );
    }
    if (err.code === 403 || err.response?.status === 403) {
      throw new CustomizedAuthorizationError(
        "Permission denied. Make sure service account has permission",
      );
    }

    throw new BaseError(500, "Internal Server Error");
  }
};
