import { Routes } from '@angular/router';
import {VprasalnikComponent} from "./components/uporabnik/vprasalnik/vprasalnik.component";
import {AdminComponent} from "./components/admin/admin/admin.component";

export const routes: Routes = [
  { path:'', redirectTo:'index.html',pathMatch:"full" },
  { path:"index.html", component:AdminComponent },
  { path:"admin.html", component:AdminComponent },
];
