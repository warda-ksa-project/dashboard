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

        this.data = {
            labels: this.labels,
            datasets: [
                {
                    type: this.type, // ✅ Use the input type dynamically
                    label: this.firstDataNAme,
                    backgroundColor: '#B49ABF',
                    borderColor: '#B49ABF', // Needed for line charts
                    fill: this.type === 'line' ? false : true, // Ensure line charts are not filled
                    data: this.firstData,
                },
                {
                    type: this.type, // ✅ Use the input type dynamically
                    label: this.secondDataName,
                    backgroundColor: '#DBCDE0',
                    borderColor: '#DBCDE0',
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
