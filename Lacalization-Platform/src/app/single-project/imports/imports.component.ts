import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../models/project.model';
import { languageService } from '../language.service';
import { ImportService } from '../../import.service';
import { SingleProjectService } from '../single-project.service';

@Component({
  selector: 'app-imports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imports.component.html',
  styleUrl: './imports.component.css'
})
export class ImportsComponent implements OnInit {
  isHovering = false;
  selectedFile: File | null = null;
  showDropdown: boolean = false;
  projectId: number | undefined;
  languages: Language[] = [];
  selectedLanguage: Language | null = null;
  creatorId!: number;

  constructor(
    private route: ActivatedRoute,
    private languageService: languageService,
    private importService: ImportService,
    private singleProjectService: SingleProjectService,
    private router: Router
  ){}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.creatorId = userId;
    }

    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadLanguages();
      }
    });
  }

  getUserIdFromLocalStorage(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });
  }

  filteredLanguages(): Language[] {
    return this.languages.filter(lang => lang.name.toLowerCase());
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.showDropdown = false;
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // importToProject() {
  //   if (this.selectedFile && this.projectId && this.selectedLanguage) {
  //     this.importService.uploadFile(this.selectedFile, this.projectId, this.selectedLanguage.id, this.creatorId)
  //       .subscribe({
  //         next: () => {
  //           // Fetch the projectLanguageId
  //           this.singleProjectService.getProjectLanguageByLanguageIdAndProjectId(this.selectedLanguage.id, this.projectId)
  //             .subscribe({
  //               next: (projectLanguage) => {
  //                 this.router.navigate(['/projectLanguage', projectLanguage.id]);
  //               },
  //               error: (error) => {
  //                 alert('Error fetching project language: ' + error.message);
  //               }
  //             });
  //         },
  //         error: (error) => {
  //           alert('Error importing file: ' + error.message);
  //         }
  //       });
  //   } else {
  //     alert('Please select a file and language to import.');
  //   }
  // }
  importToProject() {
    if (this.selectedFile && this.projectId && this.selectedLanguage) {
      this.importService.uploadFile(this.selectedFile, this.projectId, this.selectedLanguage.id, this.creatorId)
        .subscribe({
          next: () => {
            alert('File imported successfully!');
          },
          error: (error) => {
            alert('Error importing file: ' + error.message);
          }
        });
    } else {
      alert('Please select a file, and language to import.');
    }
  }
  
}
