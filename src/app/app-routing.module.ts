import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent, OverviewComponent } from './core/components';


const appRoutes: Routes = [
    {
        component: OverviewComponent,
        path: ''
    },
    {
        component: MainComponent,
        path: 'feature',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'data-table'
            },
            {
                loadChildren: './features/data-table/data-table.module#DataTableModule',
                path: 'data-table'
            }
        ]
    }
];


@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(appRoutes, {
            initialNavigation: true
        })
    ]
})
export class AppRoutingModule {
}
