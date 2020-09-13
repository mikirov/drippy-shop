import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProductSetComponent} from './product-set.component';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {AdminGuard} from '../../shared/guards/admin.guard';

const routes = [
    {path: '', canActivate: [AuthGuard], component: ProductSetComponent},
    {path: ':id', canActivate: [AuthGuard, AdminGuard], component: ProductSetComponent},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProductSetRoutingModule {
}
