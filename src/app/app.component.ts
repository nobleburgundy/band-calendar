import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { EventParserComponent } from "./components/event-parser.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, EventParserComponent],
  template: ` <app-event-parser></app-event-parser> `,
  styles: [],
})
export class AppComponent {
  title = "calendar-parser";
}
