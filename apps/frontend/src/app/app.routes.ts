import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserMessagesComponent } from './user-messages/user-messages.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'messages', component: UserMessagesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
