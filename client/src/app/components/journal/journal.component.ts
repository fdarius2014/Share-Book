import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingJournals = false;
  form;
  processing = false;
  username;
  journalPosts;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private journalService: JournalService,
  ) {
    this.createNewJournalForm();
  }

  createNewJournalForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
      ])]
    });
  }

  enableNewJournalForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewJournalForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'alphaNumericValidation': true }
    }
  }

  newJournalForm() {
    this.newPost = true;
  }

  reloadJournals() {
    this.loadingJournals = true;
    this.getAllJournals();
    setTimeout(() => {
      this.loadingJournals = false;
    }, 4000);
  }

  draftComment() {

  }

  onJournalSubmit() {
    this.processing = true;
    this.disableNewJournalForm();

    const journal = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username,
    }

    this.journalService.newJournal(journal).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableNewJournalForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllJournals();
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableNewJournalForm();
        }, 2000);
      }
    });
  }

  goBack() {
    window.location.reload();
  }

  getAllJournals() {
    this.journalService.getAllJournals().subscribe(data => {
      this.journalPosts = data.journals;
    });
  }

  deleteJournal(id, title) {
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

        this.journalService.deleteJournal(id).subscribe(data => {
          if (!data.success) {
            swal("Error!", data.message);
          } else {
            swal("Journal Titled: \"" + title + "\"", "has been Deleted!", "success");
            setTimeout(() => {
              this.reloadJournals();
            }, 1000);
          }
        });
      } else {
        //don't bother delete
      }
    });
  }

  likeJournal(id) {
    this.journalService.likeJournal(id).subscribe(data => {
      this.getAllJournals();
    });
  }

  dislikeJournal(id) {
    this.journalService.dislikeJournal(id).subscribe(data => {
      this.getAllJournals();
    });
  }

  ngOnInit() {
    //Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });

    this.getAllJournals();
  }

}
