<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
</svelte:head>

<script>
    import { onMount, onDestroy } from "svelte";

    let editorContainer;
    let toolbarContainer;
    let quillInstance;

    onMount(async () => {
        if (quillInstance) {
            return;
        }

        const Quill = (await import("quill")).default;

        quillInstance = new Quill(editorContainer, {
            modules: {
                syntax: true,
                toolbar: toolbarContainer,
            },
            theme: "snow",
            placeholder: "Compose an epic...",
        });
    });

    onDestroy(() => {
        if (editorContainer) {
            editorContainer.innerHTML = '';
        }
    });
</script>

<div id="toolbar-container" bind:this={toolbarContainer}>
    <span class="ql-formats">
        <select class="ql-font"></select>
        <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
        <button class="ql-bold" aria-label="Bold" title="Bold"></button>
        <button class="ql-italic" aria-label="Italic" title="Italic"></button>
        <button class="ql-underline" aria-label="Underline" title="Underline"></button>
        <button class="ql-strike" aria-label="Strikethrough" title="Strikethrough"></button>
    </span>
    <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
        <button class="ql-script" value="sub" aria-label="Subscript" title="Subscript"></button>
        <button class="ql-script" value="super" aria-label="Superscript" title="Superscript"></button>
    </span>
    <span class="ql-formats">
        <button class="ql-header" value="1" aria-label="Heading 1" title="Heading 1"></button>
        <button class="ql-header" value="2" aria-label="Heading 2" title="Heading 2"></button>
        <button class="ql-blockquote" aria-label="Blockquote" title="Blockquote"></button>
        <button class="ql-code-block" aria-label="Code block" title="Code block"></button>
    </span>
    <span class="ql-formats">
        <button class="ql-list" value="ordered" aria-label="Ordered list" title="Ordered list"></button>
        <button class="ql-list" value="bullet" aria-label="Bullet list" title="Bullet list"></button>
        <button class="ql-indent" value="-1" aria-label="Decrease indent" title="Decrease indent"></button>
        <button class="ql-indent" value="+1" aria-label="Increase indent" title="Increase indent"></button>
    </span>
    <span class="ql-formats">
        <button class="ql-direction" value="rtl" aria-label="Right-to-left direction" title="Right-to-left direction"></button>
        <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
        <button class="ql-link" aria-label="Insert link" title="Insert link"></button>
        <button class="ql-image" aria-label="Insert image" title="Insert image"></button>
        <button class="ql-video" aria-label="Insert video" title="Insert video"></button>
        <button class="ql-formula" aria-label="Insert formula" title="Insert formula"></button>
    </span>
    <span class="ql-formats">
        <button class="ql-clean" aria-label="Remove formatting" title="Remove formatting"></button>
    </span>
</div>
<div id="editor-container" bind:this={editorContainer}></div>

<style>
    :global(.ql-snow) {
        background-color: var(--gray-200);
    }

    :global(.ql-toolbar.ql-snow) {
        background-color: var(--gray-300);
        border: none;
    }

    :global(.ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected) {
        color: var(--blue-800);
    }

    :global(::selection) {
        background-color: var(--blue-600);
        color: var(--gray-100);
    }

    #editor-container {
        overflow-y: auto;
    }
</style>