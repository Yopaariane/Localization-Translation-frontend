import { Component, OnInit, ViewChild } from '@angular/core';
import { UserRole } from '../../models/user-role.model';
import { AuthService, Role, UserResponse } from '../../authentication/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contributors.component.html',
  styleUrls: [
    './contributors.component.css',
    '../single-project.component.css'
  ]
})
export class ContributorsComponent implements OnInit {
  @ViewChild('ModalTemplate', { static: true }) ModalTemplate: any;

  userRoles: UserRole[] = [];
  role: Role[] = [];
  projectId: number | null = null;
  userDetailsList = [];
  userRoleDetails: { userRoleId: number, user: any, role: any }[] = [];
  userEmail: string = "";

  showDropdown: boolean = false;
  selectedRole: Role | null = null;
  emailError: string | null = null;
  roleError: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        console.log("project id:", this.projectId)
        this.getUserRolesByProjectId(this.projectId);
        this.loadRoles();
      }
    });
  }

  assignRoleToUser(userRole: UserRole): void {
    this.authService.assignRoleToUser(userRole).subscribe((createdRole) => {
      this.userRoles.push(createdRole);
    });
  }

  getUserRolesByProjectId(projectId: number): void {
    this.authService.getRolesByProjectId(projectId).subscribe((roles) => {
      this.userRoles = roles;

    this.userRoles.forEach((role) => {
      this.authService.getUserById(role.userId).subscribe((user) => {
        this.authService.getRoleById(role.roleId).subscribe((roleDetail) => {
          this.userRoleDetails.push({
            userRoleId: role.id,
            user: user,
            role: roleDetail
          });
        });
      });
    });
    });
  }

  deleteUserRole(userRoleId: number): void {
    this.authService.deleteUserRole(userRoleId).subscribe(() => {
      this.userRoleDetails = this.userRoleDetails.filter(detail => detail.userRoleId !== userRoleId);
      this.reloadPage();
    });
  }

  // Modal service
  loadRoles(): void{
    this.authService.getAllRoles().subscribe((roles: Role[]) =>{
      this.role = roles;
    })
  }

  openLanguageModal() {
    this.modalService.open(this.ModalTemplate);
  }

  filteredRoles(): Role[] {
    return this.role.filter(rl => rl.name.toLowerCase());
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  selectRole(role: Role): void {
    this.selectedRole = role;
    this.showDropdown = false;
  }

  SaveContributor(modal: NgbModalRef): void{
    this.clearErrors();

    if (!this.userEmail) {
      this.emailError = 'Please enter the user email.';
      return;
    }

    if (!this.selectedRole) {
      this.roleError = 'Please select a role.';
      return;
    }

    if (this.userEmail && this.selectedRole && this.projectId !== null) {
      this.authService.getUserByEmail(this.userEmail).subscribe({
        next: (userResponse: UserResponse) => {
          const userRole: UserRole = {
            id:0,
            userId: userResponse.id,
            projectId: this.projectId!,
            roleId: this.selectedRole!.id
          };

          this.assignRoleToUser(userRole);
          this.reloadPage();
          modal.close();
        },
        error: () => {
          this.emailError = 'The email entered is incorrect. Please try again.';
        }
      });
    }
  }

  clearErrors(): void {
    this.emailError = null;
    this.roleError = null;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
