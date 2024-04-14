import {Routes} from '@angular/router';
import {VprasalnikComponent} from "./components/uporabnik/vprasalnik/vprasalnik.component";
import {AdminComponent} from "./components/admin/admin/admin.component";

export const routes: Routes = [
  //TODO naj da en input ko pride na sejo ki ni aktivna da lahko vpise sejo.
  {path: '', redirectTo: '1/index', pathMatch: "full"},
  {path: ":sejaId/index", component: VprasalnikComponent},
  {path: "admin", component: AdminComponent},
];
