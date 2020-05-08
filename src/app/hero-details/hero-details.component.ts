import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css']
})
export class HeroDetailsComponent implements OnInit {
  selectedHero: Hero;
  constructor(private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHeroesById(id).subscribe(
      hero => this.selectedHero = hero
    );
  }
  GoBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.selectedHero).subscribe(
      () => this.GoBack()
    );
  }

}
