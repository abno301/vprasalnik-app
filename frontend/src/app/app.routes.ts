import { Routes } from '@angular/router';
import {VprasalnikComponent} from "./components/uporabnik/vprasalnik/vprasalnik.component";

export const routes: Routes = [
  { path:'', redirectTo:'index.html',pathMatch:"full" },
  { path:"index.html", component:VprasalnikComponent },
];
