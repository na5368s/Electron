import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logo = require('../../assets/img/UpdateLogo.jpg');
  title = 'Update-Manager';
  showLogo = true;

  setLogo() {
    this.showLogo = false;
  }
}
