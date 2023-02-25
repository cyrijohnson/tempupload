export const SERVER_URL = "http://localhost:1337";

export const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ align: [] }],

  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],

  ["clean"], // remove formatting button
];
