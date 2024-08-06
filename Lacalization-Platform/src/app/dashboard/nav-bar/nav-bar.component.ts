import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../../storage-service.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: [
      '../dashboard.component.css',
      './nav-bar.component.css',
      ],
})
export class NavBarComponent implements OnInit {
constructor(private localStorage: StorageServiceService)
{}

  user: { id: number, name: string } | null = null;

  ngOnInit() {
    const userData = this.localStorage.getitem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }
}
