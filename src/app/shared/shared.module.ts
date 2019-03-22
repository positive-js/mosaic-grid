import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


const COMPONENTS = [];

const SERVICES = [];


@NgModule({
    imports: [RouterModule, CommonModule],
    declarations: [...COMPONENTS,],
    exports: [...COMPONENTS,]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [...SERVICES]
        };
    }
}
