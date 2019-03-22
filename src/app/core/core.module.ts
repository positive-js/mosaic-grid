import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MainComponent, MainMenuComponent, OverviewComponent, BaseComponent } from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const COMPONENTS = [
    BaseComponent,
    MainComponent,
    OverviewComponent,
    MainMenuComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    exports: [BaseComponent],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        BrowserAnimationsModule
    ]
})
export class AppCoreModule {

    constructor(@Optional() @SkipSelf() parentModule: AppCoreModule) {
        throwIfAlreadyLoaded(parentModule, 'AppCoreModule');
    }
}

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
    }
}
