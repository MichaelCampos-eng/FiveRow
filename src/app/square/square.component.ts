import { Component, Input} from '@angular/core';
type MetaData = [string, number | undefined];
@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value: MetaData | undefined;
}