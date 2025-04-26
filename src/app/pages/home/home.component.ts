import { Component, OnInit} from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { DataService } from '../../core/services/data.service';
import { RouterLink } from '@angular/router';

@Component({

  selector: 'app-home',
  imports: [FooterComponent, RouterLink ],
  standalone : true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent {
  newItems: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getNewItems().subscribe(items => {
      this.newItems = items;
    });
  }}
