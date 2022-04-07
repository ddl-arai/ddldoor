import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaviSetMemberComponent } from './navi-set-member.component';

import { AppModule } from '../app.module';

describe('NaviSetMemberComponent', () => {
  let component: NaviSetMemberComponent;
  let fixture: ComponentFixture<NaviSetMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [ NaviSetMemberComponent ]
      imports: [ AppModule ],
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
