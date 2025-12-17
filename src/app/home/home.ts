import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <section class="home-hero">
      <div>
        <p class="eyebrow">Welcome</p>
        <h1>Hello 👋</h1>
        <p class="sub">Use the navigation above to explore events.</p>
      </div>
    </section>
  `,
  styleUrls: ['./home.css'],
})
export class Home {

}