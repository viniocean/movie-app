import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { TmdbService } from '../services/tmdb.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { Auth } from 'firebase/auth'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recentMovies: any[] = []; 
  upcomingMovies: any[] = []; 
  nowPlayingMovies: any[] = []; 
  tvShows: any[] = []; 
  selectedSegment: string = '1'; 
  searchResults: any[] = []; 
  searchQuery: string = '';
  currentUser: any = null; 

  constructor(
    public tmdbService: TmdbService,
    public router: Router,
    private afAuth: AngularFireAuth 
  ) {}

  ngOnInit() {
    this.loadMovies(this.selectedSegment); 
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadMovies(segment: string) {
    if (segment === '1') {
      this.loadRecentMovies();
    } else if (segment === '2') {
      this.loadTvShows();
    }
  }

  loadRecentMovies() {
    this.tmdbService.getRecentMovies().subscribe((data: any) => {
      this.recentMovies = data.results;
    });
  }

  loadUpcomingMovies() {
    this.tmdbService.getUpcomingMovies().subscribe((data: any) => {
      this.upcomingMovies = data.results;
    });
  }

  loadNowPlayingMovies() {
    this.tmdbService.getNowPlayingMovies().subscribe((data: any) => {
      this.nowPlayingMovies = data.results;
    });
  }

  loadTvShows() {
    this.tmdbService.getTvShows().subscribe((data: any) => {
      this.tvShows = data.results;
      this.tvShows.sort((a, b) => b.popularity - a.popularity);
    });
  }

  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    this.loadMovies(this.selectedSegment);
  }

  goToDetails(itemId: number, mediaType: string) {
    if (mediaType === 'movie') {
      this.router.navigate(['/movie-details', itemId]); 
    } else if (mediaType === 'tv') {
      this.router.navigate(['/tv-details', itemId]); 
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.currentUser = null; 
      this.router.navigate(['/login']);
    });
  }

  goToRatings() {
    this.router.navigate(['/ratings']); 
  }
  goToRecommendations() {
    this.router.navigate(['/recommendations']); 
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    menu?.open();
  }

  closeMenu() {
    const menu = document.querySelector('ion-menu');
    menu?.close();
  }

  searchMovies() {
    if (this.searchQuery.trim() !== '') {
      this.tmdbService.searchMovies(this.searchQuery).subscribe((data: any) => {
        this.searchResults = data.results;

        this.searchResults.sort((a, b) => b.popularity - a.popularity);
      });
    } else {
      this.searchResults = [];
    }
  }
}
