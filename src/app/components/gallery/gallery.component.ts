import { Component, Input } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgFor, NgIf, Dialog],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  @Input() mediaList: any;
  visible: boolean = false;
  imageSrc = '';

  // ngOnInit(): void {
  //   this.mediaList = [
  //     // { src: 'https://via.placeholder.com/300x200.png?text=Image+1', mediaTypeEnum: 1 },
  //     // { src: 'https://img-cdn.pixlr.com/image-generator/history/676d2c00e66b5d59e412c85d/5512c7d4-b3a8-46c3-9d08-cd178c377fcb/preview.webp', mediaTypeEnum: 1 },
  //     // { src: 'https://via.placeholder.com/300x200.png?text=Image+4', mediaTypeEnum: 1 },
  //     // { src: 'https://via.placeholder.com/300x200.png?text=Image+5', mediaTypeEnum: 1 },
  //     // { src: 'https://www.w3schools.com/html/mov_bbb.mp4', mediaTypeEnum: 2 },
  //     // { src: 'https://www.w3schools.com/html/movie.mp4', mediaTypeEnum: 2 },
  //     { src: 'https://abdoryad-001-site1.ktempurl.com/Images/specialOrder/dac93700-4f0c-4ece-9018-f40687918d56.png', mediaTypeEnum: 1 },

  //   ]
  // }

ngOnInit(): void {
 console.log(this.mediaList);

}

  openImage(image: string) {
    this.visible = true;
    this.imageSrc = image;
  }
}
