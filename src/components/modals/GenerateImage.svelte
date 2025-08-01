<div id="generate-image">
    <div class="section">
        <div class="coord-header">
            <i class="ph-bold ph-arrow-square-up-left"></i>
            <h3>up left</h3>
        </div>
        <div class="input-row">
            <div class="input-group">
                <label class="input-label" for="top-left-x">x:</label>
                <input type="number" min="0" step="1" id="top-left-x" class="input-field" placeholder="0" value="0">
            </div>
            <div class="input-group">
                <label class="input-label" for="top-left-y">y:</label>
                <input type="number" min="0" step="1" id="top-left-y" class="input-field" placeholder="0" value="0">
            </div>
        </div>
    </div>
    <div class="section">
        <div class="coord-header">
            <i class="ph-bold ph-arrow-square-down-right"></i>
            <h3>down right</h3>
        </div>
        <div class="input-row">
            <div class="input-group">
                <label class="input-label" for="down-right-x">x:</label>
                <input type="number" id="down-right-x" class="input-field" placeholder="100" value="100">
            </div>
            <div class="input-group">
                <label class="input-label" for="down-right-y">y:</label>
                <input type="number" min="0" step="1" id="down-right-y" class="input-field" placeholder="100" value="100">
            </div>
        </div>
    </div>
    <hr>
    <div class="section">
        <button id="generate-button">
            <i class="ph-bold ph-dna"></i>
            <p>generate</p>
        </button>
    </div>
</div>

<style>
    hr {
        width: 100%;
        border: 1px solid var(--border-subtle);
    }

    #generate-image {
        background-color: var(--bg-elevated-1);
        box-shadow: var(--shadow-colored);
        border: 1px solid var(--border-default);
        border-radius: 6px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: var(--text-primary);
    }

    .section {
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .coord-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .coord-header > i {
        color: var(--accent-secondary);
        font-size: 1.5rem;
    }

    .input-row {
        display: flex;
        gap: 1rem;
    }

    .input-field {
        max-width: 100px;
        width: 100%;
        background-color: var(--input-bg);
        border: 1px solid var(--input-border);
        border-radius: 6px;
        padding: 0.75rem;
        color: var(--input-text);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: var(--input-border-focus);
    }

    .input-field::placeholder {
        color: var(--input-placeholder);
    }

    #generate-button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        height: 42px;
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        color: var(--action-primary-text);
        background-color: var(--action-primary);
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    #generate-button:hover {
        background-color: var(--action-primary-hover);
        box-shadow: var(--shadow-md);
    }
</style>