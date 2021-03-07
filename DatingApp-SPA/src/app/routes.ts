import {Routes} from '@angular/router';
import { HomeComponent} from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemeberDetailComponent } from './members/memeber-detail/memeber-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemeberListResolver } from './_resolvers/member-list.resolver';

export const appRoutes: Routes = [
    {path : '', component : HomeComponent},

    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path : 'members' , component : MemberListComponent , resolve: {users: MemeberListResolver}},
            { path : 'members/:id' , component : MemeberDetailComponent , resolve: {user : MemberDetailResolver}},
            { path: 'member/edit', component: MemberEditComponent,
            resolve : {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
            { path : 'lists' , component : ListsComponent , resolve: {users: ListsResolver}},
            { path : 'messages' , component : MessagesComponent},
        ]
    },
    { path : '**' , redirectTo: '' , pathMatch : 'full'}
];
