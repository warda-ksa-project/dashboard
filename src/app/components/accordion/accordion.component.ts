import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [Accordion, AccordionHeader, AccordionPanel, AccordionContent,TranslatePipe],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent {
@Input({required:true})value:any
}
