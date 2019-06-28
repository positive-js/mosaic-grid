import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';


@Directive({
    selector: '[mcElementWidth]'
})
export class ElementWidthDirective implements AfterViewInit {
    @Output()
    mcElementWidth = new EventEmitter();

    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        // this.mcElementWidth.emit(this.el.nativeElement.clientWidth);
    }

    ngAfterViewChecked() {
        this.mcElementWidth.emit(this.el.nativeElement.clientWidth);
    }
}
