import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Knob } from 'primeng/knob';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, RouterModule, NgIf, TranslatePipe, TitleCasePipe, Knob ,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private ApiService = inject(ApiService);

  staticDetails: any;

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getStaticData();
  }

  items: any[] = [
    { name: 'dashboard.client', value: 0, img: 'assets/images/dashboard/client.png', route: '/clients', id: 'clientCount' },
    { name: 'dashboard.technical', value: 0, img: 'assets/images/dashboard/technical-support.png', route: '/technicals', id: 'technicalCount' },
    { name: 'dashboard.order', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/orders', id: 'orderCount' },
    { name: 'dashboard.contractType', value: 0, img: 'assets/images/dashboard/contract.png', route: '/contract-type', id: 'contractTypeCount' },
    { name: 'dashboard.package', value: 0, img: 'assets/images/dashboard/package.png', route: '/package', id: 'packageCount' },
    { name: 'dashboard.paymentWay', value: 0, img: 'assets/images/dashboard/payment-method.png', route: '/paymentWay', id: 'paymentWayCount' },
    { name: 'dashboard.service', value: 0, img: 'assets/images/dashboard/customer-service.png', route: '/services', id: 'serviceCount' },
    { name: 'dashboard.workingTime', value: 0, img: 'assets/images/dashboard/timetable.png', route: '/working_hours', id: 'workingTimeCount' },
    { name: 'dashboard.termsAndConditions', value: 0, img: 'assets/images/dashboard/terms-and-conditions.png', route: '/settings/terms_conditions', id: 'termsAndConditionsCount' },
    { name: 'dashboard.technicalSpecialist', value: 0, img: 'assets/images/dashboard/public-relations.png', route: '/technical-specialist', id: 'technicalSpecialistCount' },
    // { name: 'dashboard.orderAdditionalItems', value: 0, img: 'assets/images/dashboard/checklist.png', route: '/dashboard', id: 'orderAdditionalItemsCount' },
    { name: 'dashboard.FAQs', value: 0, img: 'assets/images/dashboard/faq.png', route: '/settings/faqs', id: 'faQsCount' },
    { name: 'dashboard.country', value: 0, img: 'assets/images/dashboard/coronavirus.png', route: '/country', id: 'countryCount' },
    { name: 'dashboard.coupon', value: 0, img: 'assets/images/dashboard/coupons.png', route: '/copone', id: 'coponeCount' },
    { name: 'dashboard.complaint', value: 0, img: 'assets/images/dashboard/bad.png', route: '/complaint', id: 'complaintCount' },
    { name: 'dashboard.city', value: 0, img: 'assets/images/dashboard/cityscape.png', route: '/city', id: 'cityCount' },
    { name: 'dashboard.admin', value: 0, img: 'assets/images/dashboard/no-data.png', route: '/settings/admin', id: 'adminCount' },
    { name: 'dashboard.driver', value: 0, img: 'assets/images/dashboard/package.png', route: '/technicals', id: 'driverCount' },
    { name: 'dashboard.specialOrder', value: 0, img: 'assets/images/dashboard/coronavirus.png', route: '/special-order', id: 'specialOrderCount' },

  ];




  getDashboardDetails() {
    this.ApiService.get('Dashborad/GetAll').subscribe((res: any) => {
      console.log(res);
      this.updateItemsWithData(res.data);
    })
  }

  getStaticData() {
    this.ApiService.get('Dashborad/GetAllOrderStatistics').subscribe((res: any) => {
      console.log(res);
      this.staticDetails = res.data
    })
  }

  updateItemsWithData(data: any) {
    this.items.forEach((item: any) => {
      if (data.hasOwnProperty(item.id)) {
        item.value = data[item.id];
      }
    });
  }

}
