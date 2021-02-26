import { CodeSuccess } from "..";
/* eslint-disable camelcase */
export interface IGetDocuments {
  response: IDocument[];
}

export interface IDocument {
  document_name: string;
  document_context: string;
  engine_name: string;
}

export interface IPostDocument {
  document_name: string;
  document_context: string;
  engine: string;
}

export interface IPostDocumentPayload {
  err_code: CodeSuccess;
  response: IPostDocument;
}

export interface IPostQuestion {
  question: string;
  document_name: string;
  engine_name: string;
}

export interface IGetQuestion {
  err_code: CodeSuccess;
  question: string;
  answer: string;
}
