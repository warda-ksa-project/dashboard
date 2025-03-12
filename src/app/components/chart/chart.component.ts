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

  platformId = inject(PLATFORM_ID);

  // configService = inject(AppConfigService);

  // designerService = inject(DesignerService);

  constructor(private cd: ChangeDetectorRef) {}

  // themeEffect = effect(() => {
  //     if (this.configService.transitionComplete()) {
  //         if (this.designerService.preset()) {
  //             this.initChart();
  //         }
  //     }
  // });

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
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                  {
                      label: 'My First dataset',
                      backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                      borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                      data: [65, 59, 80, 81, 56, 55, 40]
                  },
                  {
                      label: 'My Second dataset',
                      backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                      borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                      data: [28, 48, 40, 19, 86, 27, 90]
                  }
              ]
          };

          this.options = {
              maintainAspectRatio: false,
              aspectRatio: 0.8,
              plugins: {
                  legend: {
                      labels: {
                          color: textColor
                      }
                  }
              },
              scales: {
                  x: {
                      ticks: {
                          color: textColorSecondary,
                          font: {
                              weight: 500
                          }
                      },
                      grid: {
                          color: surfaceBorder,
                          drawBorder: false
                      }
                  },
                  y: {
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
  }
}