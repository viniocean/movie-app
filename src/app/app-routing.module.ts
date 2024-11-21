import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    
    path: '',
    redirectTo: 'home', // Redireciona para a tela de login como página inicial
    pathMatch: 'full'
  },

 { path: 'welcome',
  loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
},
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'movie-details/:id',
    loadChildren: () => import('./movie-details/movie-details.module').then( m => m.MovieDetailsPageModule)
  },
  {
    path: 'ratings',
    loadChildren: () => import('./ratings/ratings.module').then( m => m.RatingsPageModule)
  },
  {
    path: 'recommendations',
    loadChildren: () => import('./recommendations/recommendations.module').then( m => m.RecommendationsPageModule)
  },
  {
    path: 'tv-details/:id',
    loadChildren: () => import('./tv-details/tv-details.module').then( m => m.TvDetailsPageModule)
  },


  
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
