type Chunk = {
  title: string; // e.g. "Hack and Slash"
  body: string; // full move text
  category: string; // e.g. "Basic Moves", "Special Moves"
  type: "move" | "rule" | "example"; // optional
  source: string; // file or section origin
};
