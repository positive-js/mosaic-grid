import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ItemsUsageComponent } from './data-binding/items-usage/items-usage.component';


const dataTableFeatureRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data-binding'
    },
    {
        component: ItemsUsageComponent,
        path: 'data-binding'
    },
];


@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(dataTableFeatureRoutes)]
})
export class DataTableFeatureRoutingModule {
}
