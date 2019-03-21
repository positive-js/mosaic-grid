import { Directive, TemplateRef } from '@angular/core';


@Directive({
    selector: '[mc-virtual-scroll]'
})
export class McVirtualScrollDirective {

    constructor(public templateRef: TemplateRef<{ $implicit: any, index: number }>) {}
}
