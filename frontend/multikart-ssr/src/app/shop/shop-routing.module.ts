import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThreeColumnComponent } from './product/three-column/three-column.component';


import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompareComponent } from './compare/compare.component';

import { Resolver } from '../shared/services/resolver.service';

const routes: Routes = [
  {
    path: 'product/three/column/:slug',
    component: ThreeColumnComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent
  },
  {
    path: 'product/set',
    loadChildren: () => import('./product-set/product-set.module').then(m => m.ProductSetModule)
  },
  // {
  //   path: 'collection/right/sidebar',
  //   component: CollectionRightSidebarComponent
  // },
  // {
  //   path: 'collection/no/sidebar',
  //   component: CollectionNoSidebarComponent
  // },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'compare',
    component: CompareComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
