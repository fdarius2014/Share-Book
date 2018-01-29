import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class JournalService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  //Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); //Get token to attach to headers
    this.options = new RequestOptions({
      //Headers configuration options
      headers: new Headers({
        'Content-Type': 'application/json', //Format set to JSON
        'authorization': this.authService.authToken //Attach the token
      })
    });
  }

  newJournal(journal) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'journals/newJournal', journal, this.options).map(res => res.json());
  }

  getAllJournals() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'journals/allJournals', this.options).map(res => res.json());
  }

  getSingleJournal(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'journals/singleJournal/' + id, this.options).map(res => res.json());
  }

  editJournal(journal) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'journals/updateJournal/', journal, this.options).map(res => res.json());
  }

  deleteJournal(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'journals/deleteJournal/' + id, this.options).map(res => res.json());
  }

  likeJournal(id) {
    const journalData = { id: id };
    return this.http.put(this.domain + 'journals/likeJournal', journalData, this.options).map(res => res.json());
  }

  dislikeJournal(id) {
    const journalData = { id: id };
    return this.http.put(this.domain + 'journals/dislikeJournal', journalData, this.options).map(res => res.json());
  }

}
