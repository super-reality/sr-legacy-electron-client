export const slashRegEx = /\//;
export const scriptRegEx = /\/\w+ ?\w+\b/g;

export const scriptsList = ["/create ai", "/create ticket"];

export const createHelpString = (arrToJoin: string[]) =>
  scriptsList.join(",\n");

// "token": "373ad9da222bb13da11a37f9b212375207bb304c"
// http://54.215.246.31/api/assistant
