// Documentation viewer for markdown files

class DocsViewer {
  constructor() {
    this.currentDoc = "README.md";
    this.initializeEventListeners();
    this.loadDocumentation(this.currentDoc);
  }

  initializeEventListeners() {
    document
      .getElementById("docsBtn")
      .addEventListener("click", () => this.openModal());
    document
      .getElementById("closeDocsBtn")
      .addEventListener("click", () => this.closeModal());
    document
      .getElementById("docsSelect")
      .addEventListener("change", (e) => this.changeDocument(e.target.value));

    // Close modal when clicking outside
    document.getElementById("docsModal").addEventListener("click", (e) => {
      if (e.target.id === "docsModal") {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        document.getElementById("docsModal").style.display !== "none"
      ) {
        this.closeModal();
      }
    });
  }

  openModal() {
    document.getElementById("docsModal").style.display = "flex";
  }

  closeModal() {
    document.getElementById("docsModal").style.display = "none";
  }

  changeDocument(filename) {
    this.currentDoc = filename;
    this.loadDocumentation(filename);
  }

  async loadDocumentation(filename) {
    try {
      const response = await fetch(filename);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      const markdown = await response.text();
      const html = this.parseMarkdown(markdown);
      document.getElementById("docsContent").innerHTML = html;
    } catch (error) {
      console.error("Error loading documentation:", error);
      document.getElementById("docsContent").innerHTML = `
        <div style="color: #d32f2f; padding: 20px;">
          <h3>Error Loading Documentation</h3>
          <p>${error.message}</p>
          <p>Make sure the file exists: <code>${filename}</code></p>
        </div>
      `;
    }
  }

  parseMarkdown(markdown) {
    // Use the marked library if available, otherwise use a simple parser
    if (typeof marked !== "undefined") {
      return marked.parse(markdown);
    } else {
      return this.simpleMarkdownParse(markdown);
    }
  }

  simpleMarkdownParse(markdown) {
    let html = markdown;

    // Headings
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/_(.+?)_/g, "<em>$1</em>");

    // Code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");

    // Code blocks
    html = html.replace(
      /```(.*?)\n([\s\S]*?)\n```/g,
      "<pre><code>$2</code></pre>",
    );

    // Links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank">$1</a>',
    );

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";

    // Lists
    html = html.replace(/^\* (.*?)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>");

    // Ordered lists
    html = html.replace(/^\d+\. (.*?)$/gm, "<li>$1</li>");

    return html;
  }
}

// Initialize docs viewer when page loads
document.addEventListener("DOMContentLoaded", () => {
  if (!window.docsViewer) {
    window.docsViewer = new DocsViewer();
  }
});
