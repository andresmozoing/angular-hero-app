import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm: FormGroup = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    //Si entra a esta pantalla EDITANDO a un heroe
    //Tenemos que cargar su data

    //Me fijo en la url si es edit o new
    if (!this.router.url.includes('edit'))
      return; //Si no es edit, lo saco

    //Para saber los parametros que vienen por el URL, puedo usar esto
    this.activatedRoute.params.
      pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        //Aca puede venir dos cosas, un heroe o un undefined
        if (!hero)
          return this.router.navigateByUrl('/');

        //Seteo las propiedades del heroe
        this.heroForm.reset(hero)
        //El reset si no le paso parametros, lo pone en cero.
        //Si le paso parametros, lo modifica
        return
      })


  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero
    return hero
  }

  onSubmitHero(): void {
    console.log({
      "formIsValid": this.heroForm.valid,
      "value": this.heroForm.value
    });
    if (!this.heroForm.valid) {
      return
    }
    else {
      if (this.heroForm.value.id) {
        this.heroesService.updateHero(this.currentHero)
          .subscribe(hero => {
            //TODO Mostrar snackbar
            this.showSnackBar(this.currentHero.superhero + ' updated')
          });
      }
      else {
        this.heroesService.addHero(this.currentHero)
          .subscribe(hero => {
            this.showSnackBar(this.currentHero.superhero + ' created')
            this.router.navigate(['/heroes/edit', this.currentHero.id])
            //TODO: Mostrar snackbar, y navegar a /heroes/edit/hero.id
          });
      }
    }

  }

  showSnackBar( texto : string){
    this.snackBar.open(texto,'done',{
      duration: 2500
    })
  }

  onDeleteHero(){
    if (!this.currentHero.id){
      throw Error('No se puede borrar el registro sin id')
    }
    else{
      //Abrir Material Dialog para confirmar

    }
  }
}
