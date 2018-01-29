import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  onLogoutClick() {
    swal({
      title: "Logging out?",
      text: "Are you sure that you want to log out?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"]
    })
    .then(willLogout => {
      if (willLogout) {
        this.authService.logout();
        swal("You are logged out!", "", "success");
        this.router.navigate(['/home']);
      } else {
        //remain logged in
      }
    });
  }

  ngOnInit() {
  }

}
