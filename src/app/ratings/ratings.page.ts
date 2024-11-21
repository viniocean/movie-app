import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.page.html',
  styleUrls: ['./ratings.page.scss'],
})
export class RatingsPage implements OnInit {
  userLoggedIn: boolean = false;
  currentUser: any = null;
  evaluations: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userLoggedIn = true;
        this.currentUser = user;
        this.loadUserEvaluations(user.uid);
      } else {
        this.userLoggedIn = false;
        this.currentUser = null;
      }
    });
  }

  loadUserEvaluations(userId: string) {
    this.afs.collection('reviews', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .subscribe(snapshot => {
        console.log('Avaliações carregadas:', snapshot);

        if (snapshot.length === 0) {
          console.log('Nenhuma avaliação encontrada para este usuário.');
        }

        this.evaluations = snapshot.map(doc => {
          const data = doc.payload.doc.data() as Evaluation;
          console.log('Dados da avaliação:', data);

          return {
            id: doc.payload.doc.id,
            comment: data.comment,
            movieId: data.movieId,
            title: data.title,  // Incluindo o campo title
            rating: data.rating,
            timestamp: data.timestamp,
            username: data.username
          };
        });

        console.log('Avaliações após o mapeamento:', this.evaluations);
      }, error => {
        console.error('Erro ao carregar as avaliações:', error);
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.userLoggedIn = false;
      this.router.navigate(['/login']);
    });
  }
}

// Interface Evaluation para tipagem correta
interface Evaluation {
  comment: string;
  movieId: number;
  rating: number;
  timestamp: any;
  userId: string;
  username: string;
  title: string;  // Adicionando title
}
