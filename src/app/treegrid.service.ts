import { Injectable } from '@angular/core'
import axios from 'axios'
import { environment } from './../environments/environment'
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class TreegridService {

  constructor(
    private http: HttpClient,
  ) { }

  get() {
    return this.http.get(`${environment.apiUrl}/api/v1/treegrid`)
  }

  save(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/v1/treegrid`, payload)
  }
}
