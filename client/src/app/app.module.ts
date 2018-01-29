import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthService } from './services/auth.service';
import { JournalService } from './services/journal.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { JournalComponent } from './components/journal/journal.component';
import { EditJournalComponent } from './components/journal/edit-journal/edit-journal.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    SignupComponent,
    LoginComponent,
    ProfileComponent,
    JournalComponent,
    EditJournalComponent,
    PublicProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, JournalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
