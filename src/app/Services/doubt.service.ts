import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoubtService {
  private hubConnection!: signalR.HubConnection;
  private doubtSubject = new Subject<any>();
  private replySubject = new Subject<any>();

  private apiUrl = 'https://localhost:7071/api/Doubt';
  // private apiUrl = 'https://SmartLms.bsite.net/api/Doubt';

  constructor(private http: HttpClient) { }

  startConnection(userId: number){
    if (this.hubConnection) return;
    const token = localStorage.getItem("Lms_token");

    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:7071/doubthub?userId=${userId}`, {
      withCredentials: true,
      accessTokenFactory: () => token || ""
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start()
      .then(()=>console.log("SignalR connected"))
      .catch(err=>console.error('Error while start signalR connection: ', err));

    this.hubConnection.on('ReceiveDoubt', (doubt) => {
      console.log('New doubt received:', doubt);
      this.doubtSubject.next(doubt);
    });

    this.hubConnection.on('ReceiveDoubtReply', (reply) => {
      console.log("receivedDoubtReply:", reply);
      this.replySubject.next(reply);
    });
  }

  onDoubtReceived(): Observable<any> {
    return this.doubtSubject.asObservable();
  }

  onReplyReceived() {
    return this.replySubject.asObservable();
  }

  raiseDoubt(doubt: any) {
    return this.http.post(`${this.apiUrl}/raise`, doubt);
  }

  getCourseDoubts(courseId: number) {
    return this.http.get(`${this.apiUrl}/course/${courseId}`);
  }

  getStudentDoubts(studentId: number){
    return this.http.get(`${this.apiUrl}/mine/${studentId}`);
  }

  replyToDoubt(reply: any) {
    return this.http.post(`${this.apiUrl}/reply`, reply);
  }
}
