import { DocPagination } from "./components/doc-pagination"
import { DocTOC } from "./components/doc-toc"
import { GButton } from "./plugins/deftheme/GButton"
// Sitename

export const XMeta = {
    siteName: "DocX - lixril",
    description: "",
    documentsPath: "content/docs",
    theme: {
        provider: [],
        colorScheme: []
    },
    searchProvider: "<void>",
    interface: {
        components: {
            button: GButton,
            pagination: DocPagination,
            TOC: DocTOC
        }
    }
}