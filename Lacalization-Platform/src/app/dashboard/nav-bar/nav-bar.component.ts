import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../../storage-service.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: [
      '../dashboard.component.css',
      './nav-bar.component.css',
      ],
})
export class NavBarComponent implements OnInit {
  showDropdown = false;

  constructor(
    private localStorage: StorageServiceService,
  ){}

  user: { id: number, name: string } | null = null;

  ngOnInit() {
    const userData = this.localStorage.getitem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  // Method to get user initials
  getUserInitials(name: string): string {
    if (!name) return '';
  
    const nameParts = name.trim().split(' ');
  
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];
    } else {
      return nameParts[0].slice(0, 2).toUpperCase();
    }
  }

  // Method to get user color based on name
  getUserColor(name: string): string {
    const colors = ['#FF5733', '#33B5E5', '#FFBB33', '#2BBBAD', '#FFC107'];
    let sumOfCharCodes = 0;

    for (let i = 0; i < name.length; i++) {
      sumOfCharCodes += name.charCodeAt(i);
    }

    return colors[sumOfCharCodes % colors.length];
  }

  // dropdown in profile 
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  navigateToProfile(): void {
    console.log('Navigating to Profile');
    this.showDropdown = false;
  }

  navigateToSettings(): void {
    console.log('Navigating to Settings');
    this.showDropdown = false;
  }

  logout(): void {
    console.log('Logging out');
    this.showDropdown = false;
  }
}
