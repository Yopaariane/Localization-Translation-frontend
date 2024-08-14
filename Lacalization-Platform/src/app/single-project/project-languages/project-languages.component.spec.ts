import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLanguagesComponent } from './project-languages.component';

describe('ProjectLanguagesComponent', () => {
  let component: ProjectLanguagesComponent;
  let fixture: ComponentFixture<ProjectLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLanguagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
