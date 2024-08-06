import { Component } from '@angular/core';
import { NavBarComponent } from '../dashboard/nav-bar/nav-bar.component';

@Component({
  selector: 'app-single-project',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.css'
})
export class SingleProjectComponent {

}
