import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../../../services/journal.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.css']
})
export class EditJournalComponent implements OnInit {

  message;
  messageClass;
  journal;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private journalService: JournalService,
    private router: Router
  ) { }

  updateJournalSubmit() {
    this.processing = true;
    this.journalService.editJournal(this.journal).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/journal']);
        }, 2000);
      }
    });
  }

  deleteJournal() {
    swal({
      title: "Confirm",
      text: "Are you sure that you want to delete this journal entry?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"]
    })
    .then(willLogout => {
      if (willLogout) {
        this.processing = true;
        swal("Journal Titled: \"" + this.journal.title + "\"", "has been Deleted!", "success");
        this.journalService.deleteJournal(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
            this.processing = false;
          } else {
            this.messageClass = 'alert alert-success';
            this.message = data.message;
            setTimeout(() => {
              this.router.navigate(['/journal']);
            }, 2000);
          }
        });
      } else {
        //remain logged in
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.journalService.getSingleJournal(this.currentUrl.id).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message= 'Journal not found';
      } else {
        this.journal = data.journal;
        this.loading = false;
      }
    });
  }

}
