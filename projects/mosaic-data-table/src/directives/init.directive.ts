import { Directive, EventEmitter, OnInit, Output } from '@angular/core';


@Directive({
    selector: '[ngInit]'
})
export class InitDirective implements OnInit {
    @Output()
    public ngInit = new EventEmitter();

    /**
     * On directive initialize.
     */
    public ngOnInit(): void {
        this.ngInit.emit();
    }
}
