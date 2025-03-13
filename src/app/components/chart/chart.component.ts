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
                    type: 'bar',
                    label: this.firstDataNAme,
                    backgroundColor: '#B49ABF',
                    data: this.firstData,

                },
                {
                    type: 'bar',
                    label: this.secondDataName,
                    backgroundColor: '#DBCDE0',
                    data: this.secondData
                },
                // {
                //     type: 'bar',
                //     label: 'Dataset 3',
                //     backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
                //     data: [41, 52, 24, 74, 23, 21, 32]
                // }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio:this.aspectRatio,
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
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
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
        this.cd.markForCheck()
    }
    console.log('ggg',this.firstData)
    console.log('ggg',this.secondData)

}
}
