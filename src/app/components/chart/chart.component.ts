import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, Input, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() data: any
  @Input() options: any
  @Input() type: any = 'bar'
  @Input()labels:string[]=[]
  @Input() firstData: number[] = []
  @Input() secondData: number[] = []
@Input()aspectRatio:number=0.8
@Input()firstDataNAme=''
@Input()secondDataName=''
  platformId = inject(PLATFORM_ID);


  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
      this.initChart();
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
        const wardaPrimary =
          documentStyle.getPropertyValue('--warda-primary').trim() || '#7a1e3b';
        const wardaPrimaryLight =
          documentStyle.getPropertyValue('--warda-primary-light').trim() || '#9b3a5a';

        this.data = {
            labels: this.labels,
            datasets: [
                {
                    type: this.type, // ✅ Use the input type dynamically
                    label: this.firstDataNAme,
                    backgroundColor: wardaPrimary,
                    borderColor: wardaPrimary,
                    fill: this.type === 'line' ? false : true, // Ensure line charts are not filled
                    data: this.firstData,
                },
                {
                    type: this.type, // ✅ Use the input type dynamically
                    label: this.secondDataName,
                    backgroundColor: wardaPrimaryLight,
                    borderColor: wardaPrimaryLight,
                    fill: this.type === 'line' ? false : true,
                    data: this.secondData
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: this.aspectRatio,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: this.type === 'bar', // Only stack bars, not lines
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: this.type === 'bar',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.cd.markForCheck();
    }
}
}
