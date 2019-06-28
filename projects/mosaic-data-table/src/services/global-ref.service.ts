import { Injectable } from '@angular/core';


/**
 * Global reference service; List all global javascript references here
 */
@Injectable()
export class GlobalRefService {
    private scrollbarWidthValue: number;

    constructor() {
        this.setScrollbarWidth();
    }

    setScrollbarWidth(): void {
        if (this.scrollbarWidthValue !== undefined) {
            return;
        }

        if (this.isBrowser) {
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.width = '100px';
            // for WinJS apps ? mb need it
            outer.style.msOverflowStyle = 'scrollbar';

            document.body.appendChild(outer);

            const widthNoScroll = outer.offsetWidth;
            // force
            outer.style.overflow = 'scroll';

            // add inner div
            const inner = document.createElement('div');
            inner.style.width = '100%';
            outer.appendChild(inner);

            const widthWithScroll = inner.offsetWidth;

            // remove outer div
            outer.parentNode.removeChild(outer);

            this.scrollbarWidthValue = widthNoScroll - widthWithScroll;
        }
    }

    get scrollbarWidth(): number {
        return this.scrollbarWidthValue;
    }

    get window(): Window {
        return window;
    }

    get isBrowser(): boolean {
        return typeof window !== 'undefined';
    }
}
