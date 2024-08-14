import { Component } from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [NavBarComponent,FormsModule, CommonModule, RouterOutlet],
  templateUrl: './translations.component.html',
  styleUrls: [
    './translations.component.css',
    '../single-project/single-project.component.css'

  ]
})
export class TranslationsComponent {

}
