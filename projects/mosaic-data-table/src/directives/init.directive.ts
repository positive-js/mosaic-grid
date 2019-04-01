import { Directive, EventEmitter, OnInit, Output } from '@angular/core';


@Directive({
    selector: '[ngInit]'
})
export class InitDirective implements OnInit {
    @Output()
    ngInit = new EventEmitter();

    ngOnInit(): void {
        this.ngInit.emit();
    }
}
