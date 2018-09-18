import { AccountInfo } from "@padlock/core/lib/auth.js";
import { localize as $l } from "@padlock/core/lib/locale.js";
import { shared, mixins } from "../styles";
import { BaseElement, element, html, property, query } from "./base.js";
import { Dialog } from "./dialog.js";

@element("pl-select-account-dialog")
export class SelectAccountDialog extends BaseElement {
    @property() accounts: AccountInfo[] = [];

    @query("pl-dialog") private _dialog: Dialog;

    private _resolve: ((acc: AccountInfo | null | "new") => void) | null;

    render() {
        return html`
            ${shared}

            <style>

                .title {
                    padding: 10px 15px;
                    text-align: center;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    ${mixins.gradientHighlight()}
                    text-shadow: rgba(0, 0, 0, 0.2) 0 2px 0;
                    color: var(--color-tertiary);
                }

                pl-dialog > * {
                    --color-background: var(--color-tertiary);
                    --color-foreground: var(--color-secondary);
                    background: var(--color-background);
                    color: var(--color-foreground);
                    text-shadow: none;
                }

                pl-dialog > :not(:last-child):not(.title) {
                    border-bottom: solid 1px var(--border-color);
                }

                .hint {
                    padding: 10px;
                    text-align: center;
                    font-size: var(--font-size-small);
                }

            </style>

            <pl-dialog @dialog-dismiss=${() => this._done(null)}>

                <div class="title">

                    <pl-icon icon="user"></pl-icon>

                    <div>${$l("Select An Account:")}</div>

                </div>

                ${this.accounts.map(
                    acc => html`
                    <pl-account-item
                        class="tap"
                        .account=${acc}
                        @click=${() => this._done(acc)}>
                    </pl-account-item>
                `
                )}

                <button class="tap" @click=${() => this._done("new")}>
                    ${$l("Invite New User...")}
                </button>

            </pl-dialog>
        `;
    }

    async show(accounts: AccountInfo[]): Promise<AccountInfo | null | "new"> {
        this.accounts = accounts;
        this.requestUpdate();
        await this.updateComplete;
        this._dialog.open = true;
        return new Promise<AccountInfo | null | "new">(resolve => {
            this._resolve = resolve;
        });
    }

    private _done(account: AccountInfo | null | "new") {
        this._resolve && this._resolve(account);
        this._resolve = null;
        this._dialog.open = false;
    }
}
