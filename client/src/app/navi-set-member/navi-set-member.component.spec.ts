import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaviSetMemberComponent } from './navi-set-member.component';

describe('NaviSetMemberComponent', () => {
  let component: NaviSetMemberComponent;
  let fixture: ComponentFixture<NaviSetMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaviSetMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviSetMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
